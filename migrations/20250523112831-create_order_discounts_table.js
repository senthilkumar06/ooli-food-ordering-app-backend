"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("food_kart_order_discounts", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            discount_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: "food_kart_discounts",
                    key: "id",
                },
            },
            order_id: {
                type: Sequelize.UUID,
                references: {
                    model: "food_kart_orders",
                    key: "id",
                },
            },
        });

        await queryInterface.addConstraint("food_kart_order_discounts", {
            fields: ["order_id", "discount_id"],
            type: "unique",
            name: "food_kart_order_discounts_unique",
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable("food_kart_order_discounts");
    },
};
