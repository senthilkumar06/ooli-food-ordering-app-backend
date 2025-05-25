import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    DataType,
    Model,
} from "sequelize-typescript";
import {
    EDiscountType,
    ETargetType,
    EValueType,
} from "@/interfaces/types.interface";

@Table({
    tableName: "food_kart_discounts",
})
export class DiscountModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    declare id: number;

    @Column(DataType.STRING)
    code: string;

    @Column(DataType.ENUM("line"))
    targetType: ETargetType;

    @Column(DataType.ENUM("coupon"))
    discountType: EDiscountType;

    @Column(DataType.ENUM("fixed", "percent"))
    valueType: EValueType;

    @Column(DataType.DECIMAL(12, 2))
    value: number;

    @Column(DataType.BOOLEAN)
    isDeleted: boolean;
}
