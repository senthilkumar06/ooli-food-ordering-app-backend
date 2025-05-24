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
import { DiscountModel } from "./discounts.model";

@Table({
    tableName: "food_kart_order_discounts",
})
export class OrderDiscountsModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.UUIDV4)
    declare id: string;

    @ForeignKey(() => OrderModel)
    @Column(DataType.UUID)
    orderId: string;

    @ForeignKey(() => DiscountModel)
    @Column(DataType.BIGINT)
    discountId: number;

    @BelongsTo(() => DiscountModel)
    discount: DiscountModel;
}
