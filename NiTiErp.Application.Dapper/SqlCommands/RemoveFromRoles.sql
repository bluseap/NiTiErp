USE [NiTiErp]
GO
/****** Object:  StoredProcedure [dbo].[RemoveFromRolesAsync]    Script Date: 2/2/2018 8:35:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROC [dbo].[RemoveFromRolesAsync]
	@RoleId NVARCHAR(1000),
	@UserId NVARCHAR(1000)
AS
BEGIN

	DECLARE @roleIdP nvarchar(1000)
	DECLARE CUR_ROLES CURSOR
	FORWARD_ONLY
	FOR
		SELECT *  FROM  [dbo].[SplitStringToTable](@RoleId, ',')
	OPEN CUR_ROLES
	WHILE 0 = 0
	BEGIN
		FETCH NEXT FROM CUR_ROLES INTO @roleIdP
		IF @@FETCH_STATUS <> 0
			BREAK

		delete AppUserRoles 
		where RoleId=(select Id from AppRoles where name=@roleIdP) and UserId= @UserId 

		--select @roleId
	END
	CLOSE CUR_ROLES
	DEALLOCATE CUR_ROLES

	select 'OK' as Result
	--SELECT *  FROM  [dbo].[SplitStringToTable](@RoleId, ',')
	--SELECT * FROM AppUserRoles
	--SELECT *  FROM  [dbo].[SplitStringToTable]('Customer,Read only,', ',')
	--RemoveFromRolesAsync 'Customer,Read only,','0C39CD0F-A3B9-4538-A34C-08D56932C0C2'
END

USE [NiTiErp]
GO
/****** Object:  UserDefinedFunction [dbo].[SplitStringToTable]    Script Date: 2/2/2018 10:08:44 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- chat cuoi ky tu dau phay SELECT *  FROM  [dbo].[SplitStringToTable](Customer,Read only,', ',')
create FUNCTION [dbo].[SplitStringToTable]
(
    @string NVARCHAR(MAX),
    @delimiter CHAR(1)
)
RETURNS @output TABLE(
    data NVARCHAR(MAX)
)
BEGIN
    DECLARE @start INT, @end INT
    SELECT @start = 1, @end = CHARINDEX(@delimiter, @string)

    WHILE @start < LEN(@string) + 1 BEGIN
        IF @end = 0 
            SET @end = LEN(@string) + 1

        INSERT INTO @output (data) 
        VALUES(SUBSTRING(@string, @start, @end - @start))
        SET @start = @end + 1
        SET @end = CHARINDEX(@delimiter, @string, @start)
    END
    RETURN
END

