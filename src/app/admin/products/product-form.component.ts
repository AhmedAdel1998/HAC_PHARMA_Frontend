import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/cms.models';

@Component({
    selector: 'app-product-form',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, RouterLink, FormsModule],
    template: `
        <div class="form-container">
            <div class="page-header">
                <div class="header-left">
                    <a routerLink="/admin/products" class="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Back to Products
                    </a>
                    <h1>{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h1>
                </div>
            </div>

            @if (loading()) {
                <div class="loading">Loading product details...</div>
            } @else {
                <form [formGroup]="productForm" (ngSubmit)="save()">
                    <div class="form-grid">
                        <div class="form-section">
                            <h2>Basic Information</h2>
                            
                            <div class="form-group">
                                <label>Product Name (English)</label>
                                <input type="text" formControlName="name" placeholder="e.g. Panadol" />
                            </div>

                            <div class="form-group">
                                <label>Product Name (Arabic)</label>
                                <input type="text" formControlName="nameAr" placeholder="مثال: بنادول" dir="rtl" />
                            </div>

                            <div class="form-group">
                                <label>Category</label>
                                <div class="category-row">
                                    <select formControlName="categoryId">
                                        <option [ngValue]="0">Select Category</option>
                                        @for (cat of categories(); track cat.id) {
                                            <option [ngValue]="cat.id">{{ cat.name }}</option>
                                        }
                                    </select>
                                    <button type="button" class="btn-add-category" (click)="showAddCategory.set(!showAddCategory())">
                                        {{ showAddCategory() ? '✕' : '+ Add' }}
                                    </button>
                                </div>
                                @if (showAddCategory()) {
                                    <div class="add-category-form">
                                        <input type="text" [(ngModel)]="newCategoryName" [ngModelOptions]="{standalone: true}" placeholder="Category name" />
                                        <button type="button" class="btn-save-category" (click)="addCategory()" [disabled]="!newCategoryName || savingCategory()">
                                            {{ savingCategory() ? 'Saving...' : 'Save' }}
                                        </button>
                                    </div>
                                }
                            </div>

                            <div class="form-group">
                                <label>Dosage</label>
                                <input type="text" formControlName="dosage" placeholder="e.g. 500mg" />
                            </div>
                        </div>

                        <div class="form-section">
                            <h2>Status & Pricing</h2>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Price (SAR)</label>
                                    <input type="number" formControlName="priceSar" min="0" step="0.01" />
                                </div>
                                <div class="form-group">
                                    <label>Price (USD)</label>
                                    <input type="number" formControlName="priceUsd" min="0" step="0.01" />
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Stock Status</label>
                                <select formControlName="stockStatus">
                                    <option value="available">Available</option>
                                    <option value="limited">Limited Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>

                            <div class="form-group checkbox">
                                <label>
                                    <input type="checkbox" formControlName="isActive" />
                                    Active (Visible on website)
                                </label>
                            </div>
                        </div>

                        <div class="form-section full-width">
                            <h2>Details</h2>
                            
                            <div class="form-group">
                                <label>Description (English)</label>
                                <textarea formControlName="description" rows="4"></textarea>
                            </div>

                            <div class="form-group">
                                <label>Description (Arabic)</label>
                                <textarea formControlName="descriptionAr" rows="4" dir="rtl"></textarea>
                            </div>

                            <div class="form-group">
                                <label>Image URL</label>
                                <div class="input-with-preview">
                                <input type="text" formControlName="image" placeholder="https://..." />
                                    <div class="preview-box">
                                        @if (productForm.get('image')?.value) {
                                            <img [src]="productForm.get('image')?.value" alt="Preview" />
                                        } @else {
                                            <span>No Image</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" routerLink="/admin/products" class="btn-secondary">Cancel</button>
                        <button type="submit" class="btn-primary" [disabled]="productForm.invalid || saving()">
                            {{ saving() ? 'Saving...' : 'Save Product' }}
                        </button>
                    </div>

                    @if (error()) {
                        <div class="error-message">
                            {{ error() }}
                        </div>
                    }
                </form>
            }
        </div>
    `,
    styles: [`
        .form-container { max-width: 1000px; padding-bottom: 40px; }
        .page-header { margin-bottom: 24px; }
        .back-link { display: flex; align-items: center; gap: 6px; color: #64748B; text-decoration: none; font-size: 14px; margin-bottom: 8px; }
        .back-link:hover { color: #0EA5E9; }
        h1 { font-size: 24px; font-weight: 700; color: #1E293B; }

        .loading { text-align: center; padding: 60px; color: #64748B; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .form-section { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .form-section.full-width { grid-column: 1 / -1; }
        .form-section h2 { font-size: 16px; font-weight: 600; color: #1E293B; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; color: #64748B; margin-bottom: 6px; }
        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group textarea,
        .form-group select {
            width: 100%; padding: 10px; border: 1px solid #E2E8F0; border-radius: 8px;
            font-size: 14px; color: #1E293B; background: #F8FAFC;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
            outline: none; border-color: #0EA5E9; background: white;
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .category-row { display: flex; gap: 8px; }
        .category-row select { flex: 1; }
        .btn-add-category {
            padding: 10px 16px; background: #10B981; color: white; border: none; border-radius: 8px;
            font-weight: 600; cursor: pointer; white-space: nowrap;
        }
        .btn-add-category:hover { background: #059669; }
        .add-category-form {
            display: flex; gap: 8px; margin-top: 8px; padding: 12px; background: #F0FDF4; border-radius: 8px;
        }
        .add-category-form input { flex: 1; padding: 8px 12px; border: 1px solid #D1FAE5; border-radius: 6px; }
        .btn-save-category {
            padding: 8px 16px; background: #10B981; color: white; border: none; border-radius: 6px;
            font-weight: 600; cursor: pointer;
        }
        .btn-save-category:hover { background: #059669; }
        .btn-save-category:disabled { opacity: 0.5; cursor: not-allowed; }

        .checkbox label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #1E293B; font-weight: 500; }
        .checkbox input { width: 18px; height: 18px; }

        .input-with-preview { display: flex; gap: 16px; align-items: flex-start; }
        .input-with-preview input { flex: 1; }
        .preview-box {
            width: 60px; height: 60px; border-radius: 8px; background: #F1F5F9; border: 1px solid #E2E8F0;
            display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; }
        .preview-box span { font-size: 10px; color: #94A3B8; text-align: center; }

        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
        .btn-secondary, .btn-primary {
            padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; font-size: 14px;
        }
        .btn-secondary { background: white; border: 1px solid #E2E8F0; color: #64748B; }
        .btn-secondary:hover { border-color: #94A3B8; color: #1E293B; }
        .btn-primary { background: #0EA5E9; color: white; }
        .btn-primary:hover { background: #0284C7; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-message { margin-top: 16px; padding: 12px; background: #FEE2E2; color: #DC2626; border-radius: 8px; }

        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
    `]
})
export class ProductFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly productService = inject(ProductService);

    productForm = this.fb.group({
        name: ['', Validators.required],
        nameAr: [''],
        categoryId: [0, [Validators.required, Validators.min(1)]],
        description: [''],
        descriptionAr: [''],
        dosage: [''],
        priceSar: [0, [Validators.required, Validators.min(0)]],
        priceUsd: [0, [Validators.required, Validators.min(0)]],
        stockStatus: ['available', Validators.required],
        isActive: [true],
        image: ['']
    });

    isEditMode = signal(false);
    loading = signal(false);
    saving = signal(false);
    categories = signal<{ id: number; name: string }[]>([]);
    error = signal<string | null>(null);
    productId: number | null = null;
    showAddCategory = signal(false);
    newCategoryName = '';
    savingCategory = signal(false);

    ngOnInit() {
        this.loadCategories();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode.set(true);
                this.productId = +params['id'];
                this.loadProduct(this.productId);
            }
        });
    }

    loadCategories() {
        this.productService.getCategoriesWithIds().subscribe({
            next: (cats) => this.categories.set(cats),
            error: () => this.categories.set([{ id: 1, name: 'Cardiovascular' }, { id: 2, name: 'Oncology' }, { id: 3, name: 'Neurology' }])
        });
    }

    addCategory() {
        if (!this.newCategoryName.trim()) return;

        this.savingCategory.set(true);
        this.productService.createCategory({ name: this.newCategoryName.trim() }).subscribe({
            next: (newCat) => {
                // Add to categories list
                this.categories.update(cats => [...cats, newCat]);
                // Select the new category
                this.productForm.patchValue({ categoryId: newCat.id });
                // Reset form
                this.newCategoryName = '';
                this.showAddCategory.set(false);
                this.savingCategory.set(false);
            },
            error: (err) => {
                console.error('Failed to create category', err);
                this.savingCategory.set(false);
            }
        });
    }

    loadProduct(id: number) {
        this.loading.set(true);
        this.productService.getProduct(id).subscribe({
            next: (product) => {
                this.productForm.patchValue(product);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load product', err);
                this.error.set('Failed to load product details.');
                this.loading.set(false);
            }
        });
    }

    save() {
        if (this.productForm.invalid) return;

        this.saving.set(true);
        this.error.set(null);

        const productData = this.productForm.value as Partial<Product>;

        const request$ = this.isEditMode() && this.productId
            ? this.productService.updateProduct(this.productId, productData)
            : this.productService.createProduct(productData);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/admin/products']);
            },
            error: (err) => {
                console.error('Save failed', err);
                this.error.set('Failed to save product. Please try again.');
                this.saving.set(false);
            }
        });
    }
}
