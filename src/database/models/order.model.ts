import { EOrderStatus } from "@/interfaces/types.interface";
import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    Model,
    HasMany,
} from "sequelize-typescript";
import { OrderLineItemModel } from "./order_line_items.model";
import { OrderDiscountsModel } from "./order_discounts.model";

@Table({
    tableName: "food_kart_orders",
})
export class OrderModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.UUIDV4)
    declare id: string;

    @Column(DataType.STRING)
    name: string;

    @Column(DataType.DECIMAL(12, 2))
    subtotalPrice: number;

    @Column(DataType.DECIMAL(12, 2))
    totalPrice: number;

    @Column(DataType.BOOLEAN)
    confirmed: boolean;

    @Column(DataType.DATE)
    declare createdAt: Date;

    @Column(DataType.DATE)
    cancelledAt: Date;

    @Column(DataType.DATE)
    closedAt: Date;

    @Column(
        DataType.ENUM("draft", "placed", "confirmed", "fulfilled", "closed"),
    )
    status: EOrderStatus;

    @HasMany(() => OrderLineItemModel)
    lineItems: OrderLineItemModel[];

    @HasMany(() => OrderDiscountsModel)
    discounts: OrderDiscountsModel[];
}
