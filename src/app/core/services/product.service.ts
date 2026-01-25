import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, DrugInteraction, PaginatedResponse } from '../models/cms.models';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly API_URL = `${environment.apiUrl}/products`;

    // Get products with filtering
    getProducts(options?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
        includeInactive?: boolean;
    }): Observable<PaginatedResponse<Product>> {
        let params = new HttpParams();
        if (options?.category) params = params.set('category', options.category);
        if (options?.search) params = params.set('search', options.search);
        if (options?.page) params = params.set('page', options.page.toString());
        if (options?.limit) params = params.set('limit', options.limit.toString());
        if (options?.includeInactive) params = params.set('includeInactive', 'true');

        return this.http.get<PaginatedResponse<Product>>(this.API_URL, { params });
    }

    // Get single product
    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    // Get all categories (names only for filtering)
    getCategories(): Observable<string[]> {
        return this.http.get<{ id: number; name: string }[]>(`${this.API_URL}/categories`).pipe(
            map(cats => cats.map(c => c.name))
        );
    }

    // Get all categories with IDs (for forms)
    getCategoriesWithIds(): Observable<{ id: number; name: string }[]> {
        return this.http.get<{ id: number; name: string }[]>(`${this.API_URL}/categories`);
    }

    // Admin: Create category
    createCategory(category: { name: string; code?: string; description?: string }): Observable<{ id: number; name: string }> {
        return this.http.post<{ id: number; name: string }>(`${this.API_URL}/categories`, category, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Delete category
    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/categories/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Get drug interactions
    getInteractions(productId: number): Observable<DrugInteraction[]> {
        return this.http.get<DrugInteraction[]>(`${this.API_URL}/${productId}/interactions`);
    }

    // Admin: Create product
    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.API_URL, product, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Update product
    updateProduct(id: number, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.API_URL}/${id}`, product, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Delete product
    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Compare products
    compareProducts(ids: number[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', ids.join(','));
        return this.http.get<Product[]>(`${this.API_URL}/compare`, { params });
    }
}
