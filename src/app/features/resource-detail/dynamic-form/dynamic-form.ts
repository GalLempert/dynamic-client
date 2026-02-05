import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css'
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() schema: any;
  @Input() data: any;
  @Input() isEditing = false;
  @Output() save = new EventEmitter<any>();

  form: FormGroup;
  fields: string[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Rebuild form if data or schema changes
    if (changes['data'] || changes['schema']) {
        this.buildForm();
    }
  }

  buildForm() {
    if (!this.schema || !this.data) return;

    this.fields = Object.keys(this.schema.properties || {});

    const group: any = {};
    this.fields.forEach(field => {
      const fieldSchema = this.schema.properties[field];
      // Only handle primitives for editing in this demo
      if (fieldSchema.type !== 'object' && fieldSchema.type !== 'array') {
         group[field] = [this.data[field] !== undefined ? this.data[field] : ''];

         // Disable if readOnly
         if (fieldSchema.readOnly) {
            // We can handle this in template or disable control
         }
      }
    });

    this.form = this.fb.group(group);
  }

  getFieldType(field: string): string {
      const type = this.schema.properties[field]?.type;
      if (type === 'number' || type === 'integer') return 'number';
      return 'text';
  }

  isBoolean(field: string): boolean {
      return this.schema.properties[field]?.type === 'boolean';
  }

  isPrimitive(field: string): boolean {
      const type = this.schema.properties[field]?.type;
      return type !== 'object' && type !== 'array';
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
