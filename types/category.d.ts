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
        aggregatedData: AggregatedData;
        loadingYears: Set<number>;
    }

    interface CategoryData {
        title: string;
        color: string;
        group: string;
        name: string;
        month: number;
        total: number;
    }
      
    // interface YearData {
    //   [categoryName: string]: CategoryData;
    // }
    
    interface AggregatedData {
      [year: number]: CategoryData[];
    }
    
}

export {};