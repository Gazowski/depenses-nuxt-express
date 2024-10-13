declare global {
    interface Category {
        id: string;
        name: string;
        title: string;
        color: string;
        groupe: string;
        keywords: string[];
        totalAmount: {};
    }

    interface CategoryState {
        categories: Category[];
        loading: boolean;
        error: string | null;
    }
    
}

export {};