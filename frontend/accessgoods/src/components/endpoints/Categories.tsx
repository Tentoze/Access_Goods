import Api from "./api";
import CategoryDto from "../atoms/CategoryDto";

export const getCategories = async () => {
    try {
        const response = await Api.get(`/categories/getAll`);
        const categoriesData  = response.data;
        const categories: CategoryDto[] = categoriesData.map((category: any) => {
            return new CategoryDto(category.id, category.name);
        });
        return categories
    } catch (error) {
        throw new Error('Not found');
    }
};