USE [NiTiErp]
GO
/****** Object:  StoredProcedure [dbo].[RemoveProductImagesPara]    Script Date: 2/8/2018 9:56:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create PROC [dbo].[RemoveProductImagesPara]
	@productImagesId int,
	@productId int,
	@id int,
	@stringId nvarchar(1000),
	@cobien varchar(20)
AS
BEGIN

	-- @stringId	string image[]  RemoveProductImagesPara 1,3,1,'108,109,','delproimages'
	if @cobien = 'delproimages'
	begin	
		
		create table #tempProductImages(tempId int, tempProductId int)

		DECLARE @roleIdP nvarchar(1000)
		DECLARE CUR_ROLES CURSOR
		FORWARD_ONLY
		FOR
			SELECT *  FROM  [dbo].[SplitStringToTable](@stringId, ',')
		OPEN CUR_ROLES
		WHILE 0 = 0
		BEGIN
			FETCH NEXT FROM CUR_ROLES INTO @roleIdP
			IF @@FETCH_STATUS <> 0
				BREAK

			insert into #tempProductImages(tempId, tempProductId)
			select Id, ProductId from ProductImages where Id=@roleIdP and ProductId=@productId
			
		END
		CLOSE CUR_ROLES
		DEALLOCATE CUR_ROLES

		delete ProductImages where ProductId=@productId and  Id not in (select tempId from #tempProductImages)

	--	select * from #tempProductImages
		select 'OK' as Result
	end

END