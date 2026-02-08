import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SchemaService } from '../../core/services/schema';
import { ApiService } from '../../core/services/api';
import { ResourceDefinition } from '../../core/models/resource';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent implements OnInit {
  resources: ResourceDefinition[] = [];
  selectedResource: string = '';
  searchTerm: string = '';
  results: any[] = [];
  loading = false;

  constructor(
    private schemaService: SchemaService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.schemaService.resources$.subscribe(res => {
      this.resources = res;
      if (res.length > 0 && !this.selectedResource) {
        this.selectedResource = res[0].name;
      }
    });
  }

  search() {
    if (!this.selectedResource) return;

    this.loading = true;
    const field = this.schemaService.getDefaultSearchField(this.selectedResource);

    this.apiService.search(this.selectedResource, this.searchTerm, field).subscribe({
      next: (data) => {
        console.log('Search Component Next:', data);
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search Component Error:', err);
        this.loading = false;
      }
    });
  }

  goToDetail(item: any) {
    this.router.navigate(['/myclient', this.selectedResource, item.id]);
  }
}
