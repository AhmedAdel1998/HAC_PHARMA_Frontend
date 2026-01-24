import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-products',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, FormsModule, DecimalPipe],
    template: `
        <div class="products-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>Products</h1>
                    <p>Manage your product catalog</p>
                </div>
                <a routerLink="/admin/products/new" class="btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Product
                </a>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search products..."
                        [(ngModel)]="searchQuery"
                        (input)="filterProducts()"
                    />
                </div>
                <select [(ngModel)]="selectedCategory" (change)="filterProducts()">
                    <option value="">All Categories</option>
                    @for (cat of categories(); track cat) {
                        <option [value]="cat">{{ cat }}</option>
                    }
                </select>
            </div>

            <!-- Products Table -->
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price (SAR)</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (product of filteredProducts(); track product.id) {
                            <tr>
                                <td>
                                    <div class="product-cell">
                                        <img [src]="product.image || 'assets/placeholder.png'" alt="" />
                                        <div>
                                            <strong>{{ product.name }}</strong>
                                            <span>{{ product.dosage }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="category-badge">{{ product.category }}</span>
                                </td>
                                <td>{{ product.priceSar | number:'1.2-2' }}</td>
                                <td>
                                    <span class="stock-badge" [class]="product.stockStatus">
                                        {{ product.stockStatus }}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge" [class.active]="product.isActive">
                                        {{ product.isActive ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="actions">
                                        <a [routerLink]="['/admin/products', product.id, 'edit']" class="btn-icon" title="Edit">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </a>
                                        <button class="btn-icon danger" (click)="deleteProduct(product)" title="Delete">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .products-container {
            max-width: 1400px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .page-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 4px;
        }

        .page-header p {
            color: #64748B;
            font-size: 14px;
        }

        .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: #0EA5E9;
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary:hover {
            background: #0284C7;
        }

        .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }

        .search-box {
            flex: 1;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
        }

        .search-box svg {
            color: #94A3B8;
        }

        .search-box input {
            flex: 1;
            border: none;
            font-size: 14px;
            outline: none;
        }

        select {
            padding: 12px 16px;
            border: 1px solid #E2E8F0;
            border-radius: 10px;
            background: white;
            font-size: 14px;
            min-width: 180px;
        }

        .table-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 16px;
            text-align: left;
            border-bottom: 1px solid #E2E8F0;
        }

        th {
            background: #F8FAFC;
            font-size: 13px;
            font-weight: 600;
            color: #64748B;
            text-transform: uppercase;
        }

        td {
            font-size: 14px;
            color: #1E293B;
        }

        .product-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .product-cell img {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            background: #F1F5F9;
        }

        .product-cell strong {
            display: block;
            font-weight: 600;
        }

        .product-cell span {
            font-size: 12px;
            color: #64748B;
        }

        .category-badge {
            padding: 4px 10px;
            background: #F0F9FF;
            color: #0EA5E9;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
        }

        .stock-badge {
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
        }

        .stock-badge.available { background: #D1FAE5; color: #059669; }
        .stock-badge.limited { background: #FEF3C7; color: #D97706; }
        .stock-badge.out_of_stock { background: #FEE2E2; color: #DC2626; }

        .status-badge {
            padding: 4px 10px;
            background: #FEE2E2;
            color: #DC2626;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
        }

        .status-badge.active {
            background: #D1FAE5;
            color: #059669;
        }

        .actions {
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            padding: 8px;
            background: #F1F5F9;
            border: none;
            border-radius: 8px;
            color: #64748B;
            cursor: pointer;
            text-decoration: none;
            display: flex;
            transition: all 0.2s;
        }

        .btn-icon:hover {
            background: #E2E8F0;
            color: #0EA5E9;
        }

        .btn-icon.danger:hover {
            background: #FEE2E2;
            color: #DC2626;
        }
    `]
})
export class AdminProductsComponent implements OnInit {
    private readonly productService = inject(ProductService);

    products = signal<Product[]>([]);
    filteredProducts = signal<Product[]>([]);
    categories = signal<string[]>([]);
    searchQuery = '';
    selectedCategory = '';

    ngOnInit(): void {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts(): void {
        this.productService.getProducts({ includeInactive: true }).subscribe({
            next: (response) => {
                this.products.set(response.items);
                this.filteredProducts.set(response.items);
            },
            error: (err) => {
                console.error('Failed to load products', err);
                this.products.set([]);
                this.filteredProducts.set([]);
            }
        });
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (cats) => this.categories.set(cats),
            error: (err) => {
                console.error('Failed to load categories', err);
                this.categories.set([]);
            }
        });
    }

    filterProducts(): void {
        let result = this.products();

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        if (this.selectedCategory) {
            result = result.filter(p => p.category === this.selectedCategory);
        }

        this.filteredProducts.set(result);
    }

    deleteProduct(product: Product): void {
        if (confirm(`Delete "${product.name}"?`)) {
            this.productService.deleteProduct(product.id).subscribe({
                next: () => this.loadProducts(),
                error: (err) => console.error('Delete failed', err)
            });
        }
    }
}
