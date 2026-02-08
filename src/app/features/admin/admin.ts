import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchemaService, ResourceDefinition } from '../../core/services/schema';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  resources: ResourceDefinition[] = [];

  constructor(public schemaService: SchemaService) {}

  ngOnInit(): void {
    this.schemaService.resources$.subscribe(res => {
      this.resources = res;
    });
  }

  getFields(resource: ResourceDefinition): string[] {
    return Object.keys(resource.schema.properties || {});
  }

  updateDefaultSearchField(resourceName: string, field: string) {
    this.schemaService.setDefaultSearchField(resourceName, field);
  }
}
