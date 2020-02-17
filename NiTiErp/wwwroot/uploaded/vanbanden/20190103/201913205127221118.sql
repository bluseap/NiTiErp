USE [NiTiErp]
GO
/****** Object:  StoredProcedure [dbo].[ChiPhiKhoiTaoAUD]    Script Date: 11/22/2018 2:14:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[ChiPhiKhoiTaoAUD]
	@Id int,
	@ChiPhiId int,
	@IsKyKhoiTao bit,
	@KyKhoiTao Datetime,
	@IsChuyenKy bit,	
	@GhiChu nvarchar(1000),

	@Stt int,

	@CreateDate datetime,
	@CreateBy nvarchar(50),	
	@UpdateDate datetime,
	@UpdateBy nvarchar(50),

	@parameters varchar(50)
AS
BEGIN	
	SET NOCOUNT ON 	
	
	if @parameters = 'InChiPhiKhoiTao'
	begin
		declare @chiphikhoitaoId int

		set @chiphikhoitaoId = (select max(Id) from ChiPhiKhoiTao)

		if @chiphikhoitaoId is null 
		begin 
			set @chiphikhoitaoId='1'			
		end		
		else
		begin
			set @chiphikhoitaoId = @chiphikhoitaoId + 1
		end
		--select @chiphiId

		declare @TransInChiPhiKhoiTao varchar(50) = 'TransInChiPhiKhoiTao'
		begin transaction @TransInChiPhiKhoiTao
		
		
		insert into [ChiPhiKhoiTao] ( [Id]      ,[ChiPhiId]      ,[IsKyKhoiTao]      ,[KyKhoiTao]
			,[IsChuyenKy]      ,[GhiChu]      ,[Status]      ,[Active]      ,[Stt]      ,[CreateDate]      ,[CreateBy]  )		
		values (  @chiphikhoitaoId      ,@ChiPhiId      ,0      ,@KyKhoiTao     
		 ,@IsChuyenKy  , @GhiChu 	  ,1      , 1      ,  @Stt     , @CreateDate      ,@CreateBy      )
		  	

		declare @ischiphitang bit = (select IsChiPhiTang from ChiPhi where Id = @ChiPhiId)
		declare @tenchiphi nvarchar(200) = (select TenChiPhi from ChiPhi where Id = @ChiPhiId) 
		declare @chiphikhuvuc varchar(50) = (select CorporationId from ChiPhi where Id = @ChiPhiId)
		declare @chiphikhac decimal(18,4) = case when (select ChiPhiKhac from ChiPhi where Id = @ChiPhiId) is null then 0
			else (select ChiPhiKhac from ChiPhi where Id = @ChiPhiId)  end
		declare @chiphibangdanhmuc int = (select ChiPhiBangDanhMucId from ChiPhi where Id = @ChiPhiId)
		declare @codechiphi nvarchar(100) = (select cb.CodeChiPhi from ChiPhi cp 
			inner join ChiPhiBangDanhMuc cb on cb.Id = cp.ChiPhiBangDanhMucId where cp.Id = @ChiPhiId)

		if @ischiphitang = 1 -- tinh chi phi tang
		begin
			declare @maxluongcptang bigint = (select Max(Id) from LuongCPTang)
			if @maxluongcptang is null 
			begin
				set @maxluongcptang = 1
			end
			else
			begin
				set @maxluongcptang = @maxluongcptang + 1
			end

			insert into LuongCPTang (  [Id]      ,[Nam]      ,[Thang]      ,[HoSoNhanVienId]      ,[ChiPhiId]     ,[TenChiPhi] 
		--  ,[SoTienChiPhi]      ,[SoNgayCongXMucLuongNgay]      ,[SoGioCongXMucLuongGio]
     -- ,[SoTienXSoNgayCong]      ,[HeSoXTienThucLinh]      ,[HeSoXThanhTien]      ,[HeSoXMucLuong]
      ,[TongTienCPTang]      ,[IsChuyenKy]      ,[LuongDotInKyId]      ,[Status]      ,[Active]
      ,[Stt]      ,[CreateDate]      ,[CreateBy]     -- ,[UpdateDate]      ,[UpdateBy]
	  )
			select @maxluongcptang + ROW_NUMBER() OVER(ORDER BY hs.Id) , bh.Nam, bh.Thang, hs.Id, @ChiPhiId	, @tenchiphi
			, case when @codechiphi = 'NHAPTIEN' then @chiphikhac
				when @codechiphi = 'NHAPTIENNGAYCONG' then @chiphikhac * bh.SoNgay
				when @codechiphi = 'NHAPHESOTIENTHUCLINH' then @chiphikhac * la.TongLuongThucLanhAll
				when @codechiphi = 'NHAPHESOTHANHTIEN' then @chiphikhac * bh.TienBaoHiem
				when @codechiphi = 'NHAPHESOMUCLUONG' then @chiphikhac * bh.MucLuong
				when @codechiphi = 'NHAPTIENNGAYAN' then @chiphikhac * bh.SoNgayAn
				when @codechiphi = 'NHAPTIENHESO' then @chiphikhac * bh.HeSo -- he so bac luong hien tai
				when @codechiphi = 'NHAPHESOMUCLUONGCOBAN' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPNGAYCONGMUCLUONGNGAY' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPGIOCONGMUCLUONGGIO' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPKHAC' then @chiphikhac * bh.MucLuongToiThieu
				end
			, @IsChuyenKy, bh.LuongDotInKyId, 1, 1
			, 1, GETDATE(), 'dong'
			from LuongBaoHiem bh inner join HoSoNhanVien hs on hs.Id = bh.HoSoNhanVienId and bh.Thang = month(@KyKhoiTao) 
					and bh.Nam = year(@KyKhoiTao)
				inner join LuongTongHopAll la on la.HoSoNhanVienId = hs.Id and la.Thang = month(@KyKhoiTao) 
					and la.Nam = year(@KyKhoiTao)
			where hs.CorporationId = @chiphikhuvuc 

			-- update LuongTongHop
			update LuongTongHop set TongLuongCPTang = lg.TongTienCPTang			
			from LuongTongHop th inner join ( select HoSoNhanVienId, LuongDotInKyId, sum(TongTienCPTang) as TongTienCPTang from LuongCPTang  
				where Thang = month(@KyKhoiTao)  and Nam = year(@KyKhoiTao) 
				group by HoSoNhanVienId, LuongDotInKyId ) lg on lg.HoSoNhanVienId = th.HoSoNhanVienId			
					and lg.LuongDotInKyId = th.LuongDotInKyId
			where th.Thang =  month(@KyKhoiTao)  and th.Nam = year(@KyKhoiTao)

		end
--NHAPTIEN	NHAPTIENNGAYCONG	NHAPHESOTIENTHUCLINH	NHAPHESOTHANHTIEN	NHAPHESOMUCLUONG
--NHAPTIENNGAYAN	NHAPTIENHESO	NHAPHESOMUCLUONGCOBAN	NHAPNGAYCONGMUCLUONGNGAY	NHAPGIOCONGMUCLUONGGIO	NHAPKHAC
	
		if @ischiphitang = 0 -- tinh chi phi giam
		begin
			declare @maxluongcpgiam bigint = (select Max(Id) from LuongCPGiam)
			if @maxluongcpgiam is null 
			begin
				set @maxluongcpgiam = 1
			end
			else
			begin
				set @maxluongcpgiam = @maxluongcpgiam + 1
			end

			insert into LuongCPGiam (  [Id]      ,[Nam]      ,[Thang]      ,[HoSoNhanVienId]      ,[ChiPhiId]     ,[TenChiPhi] 
		--  ,[SoTienChiPhi]      ,[SoNgayCongXMucLuongNgay]      ,[SoGioCongXMucLuongGio]
     -- ,[SoTienXSoNgayCong]      ,[HeSoXTienThucLinh]      ,[HeSoXThanhTien]      ,[HeSoXMucLuong]
      ,[TongTienCPGiam]      ,[IsChuyenKy]      ,[LuongDotInKyId]      ,[Status]      ,[Active]
      ,[Stt]      ,[CreateDate]      ,[CreateBy]     -- ,[UpdateDate]      ,[UpdateBy]
	  )
			select @maxluongcpgiam + ROW_NUMBER() OVER(ORDER BY hs.Id) , bh.Nam, bh.Thang, hs.Id, @ChiPhiId	, @tenchiphi
			, case when @codechiphi = 'NHAPTIEN' then @chiphikhac
				when @codechiphi = 'NHAPTIENNGAYCONG' then @chiphikhac * bh.SoNgay
				when @codechiphi = 'NHAPHESOTIENTHUCLINH' then @chiphikhac * la.TongLuongThucLanhAll
				when @codechiphi = 'NHAPHESOTHANHTIEN' then @chiphikhac * bh.TienBaoHiem
				when @codechiphi = 'NHAPHESOMUCLUONG' then @chiphikhac * bh.MucLuong
				when @codechiphi = 'NHAPTIENNGAYAN' then @chiphikhac * bh.SoNgayAn
				when @codechiphi = 'NHAPTIENHESO' then @chiphikhac * bh.HeSo -- he so bac luong hien tai
				when @codechiphi = 'NHAPHESOMUCLUONGCOBAN' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPNGAYCONGMUCLUONGNGAY' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPGIOCONGMUCLUONGGIO' then @chiphikhac * bh.MucLuongToiThieu
				--when @codechiphi = 'NHAPKHAC' then @chiphikhac * bh.MucLuongToiThieu
				end
			, @IsChuyenKy, bh.LuongDotInKyId, 1, 1
			, 1, GETDATE(), 'dong'
			from LuongBaoHiem bh inner join HoSoNhanVien hs on hs.Id = bh.HoSoNhanVienId and bh.Thang = month(@KyKhoiTao) 
					and bh.Nam = year(@KyKhoiTao)
				inner join LuongTongHopAll la on la.HoSoNhanVienId = hs.Id and la.Thang = month(@KyKhoiTao) 
					and la.Nam = year(@KyKhoiTao)
			where hs.CorporationId = @chiphikhuvuc 

			-- update LuongTongHop
			update LuongTongHop set TongLuongCPGiam = lg.TongTienCPGiam				
			from LuongTongHop th inner join ( select HoSoNhanVienId, LuongDotInKyId, sum(TongTienCPGiam) as TongTienCPGiam from LuongCPGiam  
				where Thang = month(@KyKhoiTao)  and Nam = year(@KyKhoiTao) 
				group by HoSoNhanVienId, LuongDotInKyId ) lg on lg.HoSoNhanVienId = th.HoSoNhanVienId 			
					and lg.LuongDotInKyId = th.LuongDotInKyId
			where th.Thang =  month(@KyKhoiTao)  and th.Nam = year(@KyKhoiTao)

		end	

		-- update LuongTongHop
		update LuongTongHop set TongLuongThucLanhAll = TongLuongBaoHiem + TongLuongThemGio + TongLuongCaBa + TongLuongCPTang 
			- TongLuongCPGiam 			
		from LuongTongHop th 	
		where th.Thang =  month(@KyKhoiTao)  and th.Nam = year(@KyKhoiTao)


		-- update LuongTongHopAll
		update LuongTongHopAll set 
			 TongLuongCPGiamAll = @tongtiencpgiamall
			, TongLuongCPTangAll = @tongtiencptangall
			, TongLuongThucLanhAll = @tongluongbaohiemall - @tongtiencpgiamall + @tongtiencptangall
			
		from LuongTongHopAll th
		where th.HoSoNhanVienId = @hosonhanvienid2 	and th.Thang = @thang2 and th.Nam = @nam2 



		commit transaction @TransInChiPhiKhoiTao

		SELECT 'OK' AS KETQUA
	end

	if @parameters = 'UpChiPhiKhoiTao'
	begin	
		
		insert into ChiPhiKhoiTaoHis ( [Id]      ,[ChiPhiId]      ,[IsKyKhoiTao]      ,[KyKhoiTao]
      ,[IsChuyenKy]      ,[GhiChu]      ,[Status]      ,[Active]      ,[Stt]      ,[CreateDate]
      ,[CreateBy]      ,[UpdateDate]      ,[UpdateBy]      ,[NgayHis] )
		SELECT   [Id]      ,[ChiPhiId]      ,[IsKyKhoiTao]      ,[KyKhoiTao]
      ,[IsChuyenKy]      ,[GhiChu]      ,[Status]      ,[Active]      ,[Stt]      ,[CreateDate]
      ,[CreateBy]      ,[UpdateDate]      ,[UpdateBy]      , getdate()
		FROM [ChiPhiKhoiTao]
		where Id = @Id

		update ChiPhiKhoiTao set [ChiPhiId] = @ChiPhiId      --,[IsKyKhoiTao] = @IsKyKhoiTao  
		    ,[KyKhoiTao] = @KyKhoiTao      ,[IsChuyenKy] = @IsChuyenKy   
		  ,[GhiChu] = @GhiChu      	  , Stt = @Stt 
		  ,[UpdateDate] = @UpdateDate      ,[UpdateBy] = @UpdateBy      
		where Id = @Id	

		SELECT 'OK' AS KETQUA
	end

	if @parameters = 'DelChiPhiKhoiTao'
	begin
		insert into ChiPhiKhoiTaoHis ( [Id]      ,[ChiPhiId]      ,[IsKyKhoiTao]      ,[KyKhoiTao]
      ,[IsChuyenKy]      ,[GhiChu]      ,[Status]      ,[Active]      ,[Stt]      ,[CreateDate]
      ,[CreateBy]      ,[UpdateDate]      ,[UpdateBy]      ,[NgayHis] )
		SELECT   [Id]      ,[ChiPhiId]      ,[IsKyKhoiTao]      ,[KyKhoiTao]
      ,[IsChuyenKy]      ,[GhiChu]      ,[Status]      ,[Active]      ,[Stt]      ,[CreateDate]
      ,[CreateBy]      ,[UpdateDate]      ,[UpdateBy]      , getdate()
		FROM [ChiPhiKhoiTao]
		where Id = @Id

		delete from ChiPhiKhoiTao where Id = @Id

		SELECT 'OK' AS KETQUA
	end

end