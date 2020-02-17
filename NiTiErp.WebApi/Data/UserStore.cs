using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NiTiErp.Application.Dapper.ViewModels;

namespace NiTiErp.WebApi.Data
{
    public class UserStore : IUserStore<AppUserViewModel>, IUserEmailStore<AppUserViewModel>, IUserPhoneNumberStore<AppUserViewModel>,
          IUserTwoFactorStore<AppUserViewModel>, IUserPasswordStore<AppUserViewModel>, IUserRoleStore<AppUserViewModel>
    {
        private readonly string _connectionString;

        public UserStore(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IdentityResult> CreateAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                user.Id = Guid.NewGuid();
                await connection.ExecuteAsync($@"INSERT INTO [AspNetUsers] ([Id],[UserName], [NormalizedUserName], [Email],
                    [NormalizedEmail], [EmailConfirmed], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled],[LockoutEnabled],[AccessFailedCount])
                    VALUES (@{nameof(AppUserViewModel.Id)},@{nameof(AppUserViewModel.UserName)}, @{nameof(AppUserViewModel.NormalizedUserName)}, @{nameof(AppUserViewModel.Email)},
                    @{nameof(AppUserViewModel.NormalizedEmail)}, @{nameof(AppUserViewModel.EmailConfirmed)}, @{nameof(AppUserViewModel.PasswordHash)},
                    @{nameof(AppUserViewModel.PhoneNumber)}, @{nameof(AppUserViewModel.PhoneNumberConfirmed)}, @{nameof(AppUserViewModel.TwoFactorEnabled)},@{nameof(AppUserViewModel.LockoutEnabled)},@{nameof(AppUserViewModel.AccessFailedCount)});", user);
            }

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                await connection.ExecuteAsync($"DELETE FROM [AspNetUsers] WHERE [Id] = @{nameof(AppUserViewModel.Id)}", user);
            }

            return IdentityResult.Success;
        }

        public async Task<AppUserViewModel> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserViewModel>($@"SELECT * FROM [AspNetUsers]
                    WHERE [Id] = @{nameof(userId)}", new { userId });
            }
        }

        public async Task<AppUserViewModel> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            string username = normalizedUserName.ToLower();
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserViewModel>($@"SELECT * FROM [AppUsers]
                    WHERE [UserName] = @{nameof(username)}", new { username });
            }
        }

        public Task<string> GetNormalizedUserNameAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetUserIdAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string> GetUserNameAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(AppUserViewModel user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(AppUserViewModel user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                await connection.ExecuteAsync($@"UPDATE [AspNetUsers] SET
                    [UserName] = @{nameof(AppUserViewModel.UserName)},
                    [NormalizedUserName] = @{nameof(AppUserViewModel.NormalizedUserName)},
                    [Email] = @{nameof(AppUserViewModel.Email)},
                    [NormalizedEmail] = @{nameof(AppUserViewModel.NormalizedEmail)},
                    [EmailConfirmed] = @{nameof(AppUserViewModel.EmailConfirmed)},
                    [PasswordHash] = @{nameof(AppUserViewModel.PasswordHash)},
                    [PhoneNumber] = @{nameof(AppUserViewModel.PhoneNumber)},
                    [PhoneNumberConfirmed] = @{nameof(AppUserViewModel.PhoneNumberConfirmed)},
                    [TwoFactorEnabled] = @{nameof(AppUserViewModel.TwoFactorEnabled)}
                    WHERE [Id] = @{nameof(AppUserViewModel.Id)}", user);
            }

            return IdentityResult.Success;
        }

        public Task SetEmailAsync(AppUserViewModel user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(AppUserViewModel user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public async Task<AppUserViewModel> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserViewModel>($@"SELECT * FROM [AspNetUsers]
                    WHERE [NormalizedEmail] = @{nameof(normalizedEmail)}", new { normalizedEmail });
            }
        }

        public Task<string> GetNormalizedEmailAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task SetNormalizedEmailAsync(AppUserViewModel user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberAsync(AppUserViewModel user, string phoneNumber, CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.FromResult(0);
        }

        public Task<string> GetPhoneNumberAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task SetPhoneNumberConfirmedAsync(AppUserViewModel user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public Task SetTwoFactorEnabledAsync(AppUserViewModel user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.FromResult(0);
        }

        public Task<bool> GetTwoFactorEnabledAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task SetPasswordHashAsync(AppUserViewModel user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task<string> GetPasswordHashAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public async Task AddToRoleAsync(AppUserViewModel user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                var normalizedName = roleName.ToUpper();
                var roleId = await connection.ExecuteScalarAsync<Guid?>($"SELECT [Id] FROM [AspNetRoles] WHERE [NormalizedName] = @{nameof(normalizedName)}", new { normalizedName });
                if (!roleId.HasValue)
                {
                    roleId = Guid.NewGuid();
                    await connection.ExecuteAsync($"INSERT INTO [AspNetRoles]([Id],[Name], [NormalizedName]) VALUES(@{nameof(roleId)},@{nameof(roleName)}, @{nameof(normalizedName)})",
                       new { roleName, normalizedName });
                }
                   

                await connection.ExecuteAsync($"IF NOT EXISTS(SELECT 1 FROM [AspNetUserRoles] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}) " +
                    $"INSERT INTO [AspNetUserRoles]([UserId], [RoleId]) VALUES(@userId, @{nameof(roleId)})",
                    new { userId = user.Id, roleId });
            }
        }

        public async Task RemoveFromRoleAsync(AppUserViewModel user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                var roleId = await connection.ExecuteScalarAsync<string>("SELECT [Id] FROM [AspNetRoles] WHERE [NormalizedName] = @normalizedName", new { normalizedName = roleName.ToUpper() });
                if (!string.IsNullOrEmpty(roleId))
                    await connection.ExecuteAsync($"DELETE FROM [AspNetUserRoles] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}", new { userId = user.Id, roleId });
            }
        }

        public async Task<IList<string>> GetRolesAsync(AppUserViewModel user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                var queryResults = await connection.QueryAsync<string>("SELECT r.[Name] FROM[AppRoles] r INNER JOIN[AppUserRoles] ur ON ur.[RoleId] = r.Id  " +
                    "WHERE ur.UserId = @userId", new { userId = user.Id });

                return queryResults.ToList();
            }
        }

        public async Task<bool> IsInRoleAsync(AppUserViewModel user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                var roleId = await connection.ExecuteScalarAsync<int?>("SELECT [Id] FROM [AspNetRoles] WHERE [NormalizedName] = @normalizedName", new { normalizedName = roleName.ToUpper() });
                if (roleId == default(int)) return false;
                var matchingRoles = await connection.ExecuteScalarAsync<int>($"SELECT COUNT(*) FROM [AspNetUserRoles] WHERE [UserId] = @userId AND [RoleId] = @{nameof(roleId)}",
                    new { userId = user.Id, roleId });

                return matchingRoles > 0;
            }
        }

        public async Task<IList<AppUserViewModel>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<AppUserViewModel>("SELECT u.* FROM [AspNetUsers] u " +
                    "INNER JOIN [AspNetUserRoles] ur ON ur.[UserId] = u.[Id] INNER JOIN [AspNetRoles] r ON r.[Id] = ur.[RoleId] WHERE r.[NormalizedName] = @normalizedName",
                    new { normalizedName = roleName.ToUpper() });

                return queryResults.ToList();
            }
        }

        public void Dispose()
        {
            // Nothing to dispose.
        }
    }
}
