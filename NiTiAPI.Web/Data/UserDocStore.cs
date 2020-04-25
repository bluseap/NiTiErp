using Dapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using NiTiAPI.Dapper.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;


namespace NiTiAPI.Web.Data
{
    public class UserDocStore : IUserStore<AppUserPoDoc>, IUserEmailStore<AppUserPoDoc>, IUserPhoneNumberStore<AppUserPoDoc>,
          IUserTwoFactorStore<AppUserPoDoc>, IUserPasswordStore<AppUserPoDoc>//, IUserRoleStore<AppUser>
    {
        private readonly string _connectionString;

        public UserDocStore(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DbConnectionStringErp");
        }

        public async Task<IdentityResult> CreateAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                user.Id = Guid.NewGuid();
                await connection.ExecuteAsync($@"INSERT INTO [AppUsers] ([Id],[UserName], [NormalizedUserName], [Email],
                    [NormalizedEmail], [EmailConfirmed], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled],[LockoutEnabled],[AccessFailedCount])
                    VALUES (@{nameof(AppUserPoDoc.Id)},@{nameof(AppUserPoDoc.UserName)}, @{nameof(AppUserPoDoc.NormalizedUserName)}, @{nameof(AppUserPoDoc.Email)},
                    @{nameof(AppUserPoDoc.NormalizedEmail)}, @{nameof(AppUserPoDoc.EmailConfirmed)}, @{nameof(AppUserPoDoc.PasswordHash)},
                    @{nameof(AppUserPoDoc.PhoneNumber)}, @{nameof(AppUserPoDoc.PhoneNumberConfirmed)}, @{nameof(AppUserPoDoc.TwoFactorEnabled)},@{nameof(AppUserPoDoc.LockoutEnabled)},@{nameof(AppUserPoDoc.AccessFailedCount)});", user);
            }

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                await connection.ExecuteAsync($"DELETE FROM [AppUsers] WHERE [Id] = @{nameof(AppUserPoDoc.Id)}", user);
            }

            return IdentityResult.Success;
        }

        public async Task<AppUserPoDoc> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserPoDoc>($@"SELECT * FROM [AppUsers]
                    WHERE [Id] = @{nameof(userId)}", new { userId });
            }
        }

        public async Task<AppUserPoDoc> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserPoDoc>($@"SELECT * FROM [AppUsers]
                    WHERE [NormalizedUserName] = @{nameof(normalizedUserName)}", new { normalizedUserName });
            }
        }

        public Task<string> GetNormalizedUserNameAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetUserIdAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string> GetUserNameAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(AppUserPoDoc user, string normalizedName, CancellationToken cancellationToken)
        {
            user.NormalizedUserName = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(AppUserPoDoc user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                await connection.ExecuteAsync($@"UPDATE [AppUsers] SET
                    [UserName] = @{nameof(AppUserPoDoc.UserName)},
                    [NormalizedUserName] = @{nameof(AppUserPoDoc.NormalizedUserName)},
                    [Email] = @{nameof(AppUserPoDoc.Email)},
                    [NormalizedEmail] = @{nameof(AppUserPoDoc.NormalizedEmail)},
                    [EmailConfirmed] = @{nameof(AppUserPoDoc.EmailConfirmed)},
                    [PasswordHash] = @{nameof(AppUserPoDoc.PasswordHash)},
                    [PhoneNumber] = @{nameof(AppUserPoDoc.PhoneNumber)},
                    [PhoneNumberConfirmed] = @{nameof(AppUserPoDoc.PhoneNumberConfirmed)},
                    [TwoFactorEnabled] = @{nameof(AppUserPoDoc.TwoFactorEnabled)}
                    WHERE [Id] = @{nameof(AppUserPoDoc.Id)}", user);
            }

            return IdentityResult.Success;
        }

        public Task SetEmailAsync(AppUserPoDoc user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(AppUserPoDoc user, bool confirmed, CancellationToken cancellationToken)
        {
            user.EmailConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public async Task<AppUserPoDoc> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                return await connection.QuerySingleOrDefaultAsync<AppUserPoDoc>($@"SELECT * FROM [AppUsers]
                    WHERE [NormalizedEmail] = @{nameof(normalizedEmail)}", new { normalizedEmail });
            }
        }

        public Task<string> GetNormalizedEmailAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.NormalizedEmail);
        }

        public Task SetNormalizedEmailAsync(AppUserPoDoc user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.NormalizedEmail = normalizedEmail;
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberAsync(AppUserPoDoc user, string phoneNumber, CancellationToken cancellationToken)
        {
            user.PhoneNumber = phoneNumber;
            return Task.FromResult(0);
        }

        public Task<string> GetPhoneNumberAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumber);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PhoneNumberConfirmed);
        }

        public Task SetPhoneNumberConfirmedAsync(AppUserPoDoc user, bool confirmed, CancellationToken cancellationToken)
        {
            user.PhoneNumberConfirmed = confirmed;
            return Task.FromResult(0);
        }

        public Task SetTwoFactorEnabledAsync(AppUserPoDoc user, bool enabled, CancellationToken cancellationToken)
        {
            user.TwoFactorEnabled = enabled;
            return Task.FromResult(0);
        }

        public Task<bool> GetTwoFactorEnabledAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task SetPasswordHashAsync(AppUserPoDoc user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task<string> GetPasswordHashAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(AppUserPoDoc user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        /*public async Task AddToRoleAsync(AppUser user, string roleName, CancellationToken cancellationToken)
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

        public async Task RemoveFromRoleAsync(AppUser user, string roleName, CancellationToken cancellationToken)
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

        public async Task<IList<string>> GetRolesAsync(AppUser user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync(cancellationToken);
                var queryResults = await connection.QueryAsync<string>("SELECT r.[Name] FROM [AspNetRoles] r INNER JOIN [AspNetUserRoles] ur ON ur.[RoleId] = r.Id " +
                    "WHERE ur.UserId = @userId", new { userId = user.Id });

                return queryResults.ToList();
            }
        }

        public async Task<bool> IsInRoleAsync(AppUser user, string roleName, CancellationToken cancellationToken)
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

        public async Task<IList<AppUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            using (var connection = new SqlConnection(_connectionString))
            {
                var queryResults = await connection.QueryAsync<AppUser>("SELECT u.* FROM [AspNetUsers] u " +
                    "INNER JOIN [AspNetUserRoles] ur ON ur.[UserId] = u.[Id] INNER JOIN [AspNetRoles] r ON r.[Id] = ur.[RoleId] WHERE r.[NormalizedName] = @normalizedName",
                    new { normalizedName = roleName.ToUpper() });

                return queryResults.ToList();
            }
        }*/

        public void Dispose()
        {
            // Nothing to dispose.
        }

    }
}
