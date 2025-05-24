import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    ForeignKey,
    Model,
    BelongsTo,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

@Table({
    tableName: "food_kart_order_line_items",
})
export class OrderLineItemModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.UUIDV4)
    declare id: string;

    @ForeignKey(() => OrderModel)
    @Column(DataType.UUID)
    orderId: string;

    @ForeignKey(() => ProductModel)
    @Column(DataType.BIGINT)
    productId: number;

    @Column(DataType.DECIMAL(12, 2))
    subtotalPrice: number;

    @Column(DataType.INTEGER)
    quantity: number;

    @BelongsTo(() => ProductModel)
    product: ProductModel;
}
