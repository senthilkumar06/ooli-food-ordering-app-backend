"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createEnum("order_status", [
            "draft",
            "placed",
            "confirmed",
            "fulfilled",
            "closed",
        ]);
        await queryInterface.createTable("food_kart_orders", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            cancelled_at: Sequelize.DATE,
            confirmed: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            subtotal_price: Sequelize.DECIMAL(12, 2),
            status: {
                type: Sequelize.ENUM(
                    "draft",
                    "placed",
                    "confirmed",
                    "fulfilled",
                    "closed",
                ),
            },
            fulfilled_at: Sequelize.DATE,
            closed_at: Sequelize.DATE,
            total_price: Sequelize.DECIMAL(12, 2),
            updated_at: Sequelize.DATE,
        });

        await queryInterface.addIndex("food_kart_orders", ["created_at"], {
            name: "food_kart_orders_created_at_idx",
            order: [["created_at", "DESC"]],
        });
    },

    down: async queryInterface => {
        await queryInterface.dropTable("food_kart_orders");
        await queryInterface.dropEnum("order_status");
    },
};
