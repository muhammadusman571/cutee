export const ROLES = {
  OWNER: "owner",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGEMENT: "management",
  SUPER_COIN_SELLER: "super_coin",
  SUB_COIN_SELLER: "sub_coin_seller",
};

export const ROUTE_PERMISSIONS = {
  "/admin/dashboard": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/banner": [ROLES.OWNER],

  "/admin/admins-list": [ROLES.SUPER_ADMIN],

  "/admin/user": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/blockedUser": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/fakeUser": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/host": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "/admin/hostRequest": [ROLES.ADMIN, ROLES.SUPER_ADMIN],

  "/admin/agency": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "/admin/agencyHistory": [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  "/admin/agencyRedeemRequest": [ROLES.ADMIN, ROLES.SUPER_ADMIN],

  "/admin/coinSeller": [ROLES.OWNER],

  "/admin/userRedeemRequest": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/rooms": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/mainPlan": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/planHistory": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/game": [ROLES.OWNER],
  "/admin/gameHistory": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/giftCategory": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/gift": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/reaction": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/svip": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/ranking-frames": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/entryEffect": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/avatarFrame": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/entryBanner": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/profileBG": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/official-frames": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/theme": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/announcement": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/song": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/hashtag": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/comment": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/level": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/mainPost": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/mainVideo": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/reportedUser": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/complainRequest": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/advertisement": [ROLES.OWNER, ROLES.MANAGEMENT],

  "/admin/setting": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/admin/salary-settings": [ROLES.OWNER, ROLES.MANAGEMENT],
  "/seller/sub-coin-seller": [ROLES.SUPER_COIN_SELLER],

  "/admin/adminProfile": [
    ROLES.OWNER,
    ROLES.MANAGEMENT,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
  ],
};
