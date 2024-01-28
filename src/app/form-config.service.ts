import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {
  private readonly document = inject(DOCUMENT);
  public formlyFieldConfig = signal<FormlyFieldConfig[]>([]);


  constructor() { 
    const storedValue = localStorage.getItem('FORMLYFIELDCONFIG');
    if (storedValue) {
      try {
        const parsedStoredValue = JSON.parse(storedValue);
        if (Array.isArray(parsedStoredValue)) {
          this.formlyFieldConfig.set(parsedStoredValue);
        }
      } catch (ex: unknown) {
        console.error(`Problemns parsing __[${storedValue}]__`, ex);
      }
    }

    effect(() => {
      const nextValue = this.formlyFieldConfig();
      untracked(() => {
        localStorage.setItem('FORMLYFIELDCONFIG', JSON.stringify(nextValue));
      });
    })

    this.document?.defaultView?.addEventListener('storage', (event: StorageEvent) => {
      
      if (event.key === 'FORMLYFIELDCONFIG') {
        const activeForm = JSON.stringify(this.formlyFieldConfig());
        if (event.newValue !== activeForm) {
          try {
            const parsedStoredValue = JSON.parse(event.newValue);
            if (Array.isArray(parsedStoredValue)) {
              this.formlyFieldConfig.set(parsedStoredValue);
            }
          } catch (ex: unknown) {
            console.error(`Problemns parsing __[${storedValue}]__`, ex);
          }
        }
      }

    });

  }
}
