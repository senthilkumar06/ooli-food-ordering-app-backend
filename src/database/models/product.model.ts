import { IImages } from "@/interfaces/types.interface";
import {
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

@Table({
    tableName: "food_kart_products",
})
export class ProductModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    declare id: number;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.STRING)
    description: string;

    @Column(DataType.DECIMAL(12, 2))
    price: number;

    @Column(DataType.STRING)
    category: string;

    @Column(DataType.JSONB)
    image: IImages;

    @Column(DataType.BOOLEAN)
    isArchived: boolean;
}
