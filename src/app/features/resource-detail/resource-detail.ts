import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SchemaService, ResourceDefinition } from '../../core/services/schema';
import { ApiService } from '../../core/services/api';
import { MapComponent } from './map/map';
import { DynamicFormComponent } from './dynamic-form/dynamic-form';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [CommonModule, MapComponent, DynamicFormComponent, RouterModule],
  templateUrl: './resource-detail.html',
  styleUrl: './resource-detail.css'
})
export class ResourceDetailComponent implements OnInit {
  resourceType: string = '';
  id: string = '';
  resourceDef: ResourceDefinition | undefined;
  data: any = null;
  loading = true;
  isEditing = false;

  appName = 'DynamicClient';
  env = 'Production';

  @ViewChild(DynamicFormComponent) childForm!: DynamicFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.resourceType = params.get('resourceType') || '';
      this.id = params.get('id') || '';
      // Wait for schema to be loaded
      this.schemaService.resources$.subscribe(res => {
         if (res.length) {
             this.loadData();
         }
      });
    });
  }

  loadData() {
    this.resourceDef = this.schemaService.getResource(this.resourceType);
    if (!this.resourceDef) return;

    this.loading = true;
    this.apiService.get(this.resourceType, this.id).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  triggerSave() {
    this.childForm.submit();
  }

  onSaveData(newData: any) {
    this.apiService.update(this.resourceType, this.id, newData).subscribe(() => {
        this.data = { ...this.data, ...newData };
        this.isEditing = false;
    });
  }

  cancel() {
    this.isEditing = false;
    // reload or reset data logic if needed, but here passing [data] handles it if not mutated in place or if we reload
    this.loadData();
  }

  deleteResource() {
    if (confirm('Are you sure you want to delete this resource?')) {
      this.apiService.delete(this.resourceType, this.id).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
