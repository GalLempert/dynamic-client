import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: '<div #mapContainer class="h-full w-full bg-gray-200"></div>',
  styles: [`:host { display: block; height: 100%; width: 100%; }`]
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() location: { lat: number; lng: number } | undefined;
  @Input() name: string = '';

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: L.Map | undefined;
  private marker: L.CircleMarker | undefined;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.location) {
      if (this.map) {
        this.updateMap();
      } else if (this.mapContainer) {
        this.initMap();
      }
    }
  }

  private initMap(): void {
    if (!this.location || !this.mapContainer) return;

    this.map = L.map(this.mapContainer.nativeElement).setView([this.location.lat, this.location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.circleMarker([this.location.lat, this.location.lng], { radius: 10, color: 'blue' }).addTo(this.map);
    this.marker.bindPopup(this.name).openPopup();
  }

  private updateMap(): void {
    if (!this.map || !this.location) return;
    this.map.setView([this.location.lat, this.location.lng], 13);
    if (this.marker) {
        this.marker.setLatLng([this.location.lat, this.location.lng]);
        this.marker.bindPopup(this.name).openPopup();
    }
  }
}
