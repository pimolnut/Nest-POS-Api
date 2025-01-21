import { IsNotEmpty, IsInt, Min, IS_ARRAY } from 'class-validator';

export class OrderItemDto {
    @IsNotEmpty()
    order_item_id: number;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsInt()
    @Min(0)
    price: number;

    @IsNotEmpty()
    menu_id: number;

    @IsNotEmpty()
    sweetness_id: number;

    @IsNotEmpty()
    size_id: number;

    @IsNotEmpty()
    order_id: number;

    @IsNotEmpty()
    add_on_id: number;

    @IsNotEmpty()
    menu_type_id: number;
}
