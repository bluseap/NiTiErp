
create PROC [dbo].[GetListFunctionCanParameters]
	@canRead bit,
	@canCreate bit,
	@canUpdate bit,
	@canDelete bit,
	@roleId nvarchar(1000),
	@notes nvarchar(1000),
	@parameters varchar(50)
AS
BEGIN
	
	--	@roleId		UserId
	if @parameters = 'ListFunctionUserIdCanRead'
	begin				
		select f.Id   ,f.IconCss      ,f.[Name]      ,f.ParentId      ,f.SortOrder      ,f.[Status]	,f.[URL]
		from [Functions] f
		where f.Id in (
			select f.Id   --,f.IconCss      ,f.[Name]      ,f.ParentId      ,f.SortOrder      ,f.[Status]	,f.[URL]
			FROM [Functions] f inner join [Permissions] p on p.FunctionId = f.Id
				inner join AppUserRoles a on a.RoleId = p.RoleId and a.UserId=@roleId
			where p.CanRead=@canRead 
			group by f.Id )

	end
		 
	if @parameters = 'ListFunctionCanRead'
	begin
		select f.Id   ,f.IconCss      ,f.[Name]      ,f.ParentId      ,f.SortOrder      ,f.[Status]	,f.[URL]
		FROM [Functions] f inner join [Permissions] p on p.FunctionId = f.Id
		where p.CanRead=@canRead 

	end

END
/*
EXEC dbo.GetListFunctionCanParameters @fromDate = '12/01/2017',
                         @toDate = '01/16/2018' */