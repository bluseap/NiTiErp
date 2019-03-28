using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NiTiErp.Application.Interfaces;
using NiTiErp.Application.ViewModels.System;
using NiTiErp.Data.Entities;
using NiTiErp.Utilities.Dtos;
using NiTiErp.Application.Dapper.Interfaces;
using NiTiErp.Utilities.Helpers;

namespace NiTiErp.Application.Implementation
{
    public class UserService : IUserService
    {        
        private readonly IAppUserRolesService _appuserrolesService;
        private readonly UserManager<AppUser> _userManager;

        public UserService(UserManager<AppUser> userManager, IAppUserRolesService appuserrolesService)
        {
            _userManager = userManager;
            _appuserrolesService = appuserrolesService;            
        }       

        public async Task<bool> AddAsync(AppUserViewModel userVm)
        {
            var user = new AppUser()
            {
                UserName = userVm.UserName,
                Avatar = userVm.Avatar,
                Email = userVm.Email,
                FullName = userVm.FullName,
                HoSoNhanVienId = userVm.HoSoNhanVienId,

                DateCreated = DateTime.Now,
                UserCreated = userVm.UserCreated,
                PhoneNumber = userVm.PhoneNumber,
                CorporationId = userVm.CorporationId
            };
            var result = await _userManager.CreateAsync(user, userVm.Password);
            if (result.Succeeded && userVm.Roles.Count > 0)
            {
                var appUser = await _userManager.FindByNameAsync(user.UserName);
                if (appUser != null)
                    await _userManager.AddToRolesAsync(appUser, userVm.Roles);

            }
            return true;
        }

        public async Task<AppUserViewModel> GetUserName(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            var userVm = Mapper.Map<AppUser, AppUserViewModel>(user);
            
            return userVm;
        }

        public async Task DeleteAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            await _userManager.DeleteAsync(user);
        }

        public async Task<List<AppUserViewModel>> GetAllAsync()
        {
            return await _userManager.Users.ProjectTo<AppUserViewModel>().ToListAsync();
        }

        public PagedResult<AppUserViewModel> GetAllPagingAsync(string keyword, int page, int pageSize)
        {
            var query = _userManager.Users;
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.FullName.Contains(keyword)
                || x.UserName.Contains(keyword)
                || x.Email.Contains(keyword));

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize)
               .Take(pageSize);

            var data = query.Select(x => new AppUserViewModel()
            {
                UserName = x.UserName,
                Avatar = x.Avatar,
                BirthDay = x.BirthDay.ToString(),
                Email = x.Email,
                FullName = x.FullName,
                Id = x.Id,
                PhoneNumber = x.PhoneNumber,
                Status = x.Status,
                DateCreated = x.DateCreated

            }).ToList();
            var paginationSet = new PagedResult<AppUserViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };

            return paginationSet;
        }

        public PagedResult<AppUserViewModel> GetAllPagingAsyncCor(string keyword, int page, int pageSize, string corporationId)
        {
            /*var query = _userManager.Users.Where(x => !x.Email.Equals("khoinguyenaglx@gmail.com")
                    && !x.CorporationId.Substring(0, 2).Equals("NT"));*/
            var query = _userManager.Users.Where(x => x.CorporationId.Equals(corporationId));

            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(x => x.FullName.Contains(keyword) 
                    || x.UserName.Contains(keyword) || x.Email.Contains(keyword));

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize)
               .Take(pageSize);

            var data = query.Select(x => new AppUserViewModel()
            {
                UserName = x.UserName,
                Avatar = x.Avatar,
                BirthDay = x.BirthDay.ToString(),
                Email = x.Email,
                FullName = x.FullName,
                Id = x.Id,
                PhoneNumber = x.PhoneNumber,
                Status = x.Status,
                DateCreated = x.DateCreated

            }).ToList();
            var paginationSet = new PagedResult<AppUserViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };

            return paginationSet;
        }

        public async Task<AppUserViewModel> GetById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var roles = await _userManager.GetRolesAsync(user);
            var userVm = Mapper.Map<AppUser, AppUserViewModel>(user);
            userVm.Roles = roles.ToList();
            return userVm;
        }

        public async Task<AppUserViewModel> GetByUserName2Id(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            var userVm = Mapper.Map<AppUser, AppUserViewModel>(user);
            return userVm;
        }

        public async Task UpdateAsync(AppUserViewModel userVm)
        {
            var user = await _userManager.FindByIdAsync(userVm.Id.ToString());
            //Remove current roles in db
            var currentRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, userVm.Roles.Except(currentRoles).ToArray());
                     
            if (result.Succeeded)
            {
                string[] needRemoveRoles = currentRoles.Except(userVm.Roles).ToArray();
                await _userManager.RemoveFromRolesAsync(user, needRemoveRoles);                

                var roles = TextHelper.ConvertStringArrayToString(needRemoveRoles);

                await _appuserrolesService.RemoveFromRolesAsync(roles, user.Id.ToString());

                //Update user detail
                user.FullName = userVm.FullName;
                user.Status = userVm.Status;
                user.Email = userVm.Email;
                user.PhoneNumber = userVm.PhoneNumber;
                user.CorporationId = userVm.CorporationId;
                user.DateModified = DateTime.Now;
                user.UserModified = userVm.UserModified;
                user.HoSoNhanVienId = userVm.HoSoNhanVienId;

                user.Avatar = userVm.Avatar;

                await _userManager.UpdateAsync(user);
            }

        }

        public async Task EditPassAsync(AppUserViewModel userVm)
        {
            var user = await _userManager.FindByIdAsync(userVm.Id.ToString());

            user.DateModified = DateTime.Now;
            user.UserModified = userVm.UserModified;

            //await _userManager.ChangePasswordAsync(user, userVm.CurrentPassword, userVm.NewPassword);   
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);

            await _userManager.ResetPasswordAsync(user, token, userVm.NewPassword); 
        }
    }
}
