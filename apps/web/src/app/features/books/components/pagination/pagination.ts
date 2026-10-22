import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,
    templateUrl: './pagination.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
    @Input() currentPage = 1;
    @Input() totalPages = 0;
    @Input() totalItems = 0;
    @Input() pageSize = 20;

    @Output() pageChange = new EventEmitter<number>();

    get startItem(): number {
        if (this.totalItems === 0) {
            return 0;
        }

        return (this.currentPage - 1) * this.pageSize + 1;
    }

    get endItem(): number {
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }

    goToPage(page: number): void {
        if (
            page < 1 ||
            page > this.totalPages ||
            page === this.currentPage
        ) {
            return;
        }

        this.pageChange.emit(page);
    }
    get pages(): number[] {
        return Array.from(
            { length: this.totalPages },
            (_, index) => index + 1,
        );
    }
}