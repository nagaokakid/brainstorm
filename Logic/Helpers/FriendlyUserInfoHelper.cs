using Database.Data;
using Logic.DTOs.User;

namespace Logic.Helpers
{
    public static class FriendlyUserInfoHelper
    {
        public static FriendlyUserInfo ToFriendlyUserInfo(this string memberId, Dictionary<string, User>? users)
        {
            if (string.IsNullOrEmpty(memberId)) throw new ArgumentNullException($"{nameof(memberId)} cannot be null");
            if (users != null && users.Any() && users.TryGetValue(memberId, out var user))
            {
                return user.ToFriendlyUser();
            }

            return new FriendlyUserInfo { UserId = memberId };
        }
        public static List<FriendlyUserInfo> ToFriendlyUserInfo(this List<string>? memberIds, Dictionary<string, User>? users)
        {
            if(memberIds != null && memberIds.Any())
            {
                return memberIds.Select(x => x.ToFriendlyUserInfo(users)).ToList();
            }
            return new List<FriendlyUserInfo>();
        }
    }
}
