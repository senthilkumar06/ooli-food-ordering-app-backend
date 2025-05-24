"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("food_kart_order_line_items", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            order_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "food_kart_orders",
                    key: "id",
                },
            },
            product_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "food_kart_products",
                    key: "id",
                },
            },
            quantity: {
                type: Sequelize.BIGINT,
                allowNull: false,
                defaultValue: 1,
            },
            subtotal_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
        });

        await queryInterface.addConstraint("food_kart_order_line_items", {
            fields: ["order_id", "product_id"],
            type: "unique",
            name: "food_kart_order_line_items_unique",
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable("food_kart_order_line_items");
    },
};
