using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace NiTiErp.Data.EF.Migrations
{
    public partial class tablecorporation2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CorporationId",
                table: "Sizes",
                type: "varchar(50)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FunctionId",
                table: "Permissions",
                type: "nvarchar(450)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AddColumn<string>(
                name: "CorporationId",
                table: "Colors",
                type: "varchar(50)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CorporationId",
                table: "AppUsers",
                type: "varchar(50)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AnnouncementId",
                table: "AnnouncementUsers",
                type: "nvarchar(450)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "PageId",
                table: "AdvertistmentPositions",
                type: "nvarchar(450)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sizes_CorporationId",
                table: "Sizes",
                column: "CorporationId");

            migrationBuilder.CreateIndex(
                name: "IX_Colors_CorporationId",
                table: "Colors",
                column: "CorporationId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUsers_CorporationId",
                table: "AppUsers",
                column: "CorporationId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUsers_Corporations_CorporationId",
                table: "AppUsers",
                column: "CorporationId",
                principalTable: "Corporations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Colors_Corporations_CorporationId",
                table: "Colors",
                column: "CorporationId",
                principalTable: "Corporations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Sizes_Corporations_CorporationId",
                table: "Sizes",
                column: "CorporationId",
                principalTable: "Corporations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUsers_Corporations_CorporationId",
                table: "AppUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Colors_Corporations_CorporationId",
                table: "Colors");

            migrationBuilder.DropForeignKey(
                name: "FK_Sizes_Corporations_CorporationId",
                table: "Sizes");

            migrationBuilder.DropIndex(
                name: "IX_Sizes_CorporationId",
                table: "Sizes");

            migrationBuilder.DropIndex(
                name: "IX_Colors_CorporationId",
                table: "Colors");

            migrationBuilder.DropIndex(
                name: "IX_AppUsers_CorporationId",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "CorporationId",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "CorporationId",
                table: "Colors");

            migrationBuilder.DropColumn(
                name: "CorporationId",
                table: "AppUsers");

            migrationBuilder.AlterColumn<string>(
                name: "FunctionId",
                table: "Permissions",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "AnnouncementId",
                table: "AnnouncementUsers",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 128);

            migrationBuilder.AlterColumn<string>(
                name: "PageId",
                table: "AdvertistmentPositions",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldMaxLength: 20,
                oldNullable: true);
        }
    }
}
