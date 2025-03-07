import {IamgesUri, Icons, Images} from '../themes/Themes';

export const API = {
  auth: {
    // Auth Management
    login: '/api/login',
    signup: '/api/consumer-register',
    forgot_password: '/api/consumer-forget-password',
    check_email: '/api/exist-email-check',
    logout: '/api/logout',
    deleteAccount: 'api/delete-consumer',
    privacyPolicy: '/api/privacy-policy', // need to change if api is ready
  },
  user: {
    // User Management
    profile: '/api/my-profile',
    edit_profile: '/api/edit-my-profile',
    update_location: '/api/currect-location',
    preferences: '/api/save-preferences',
    favourite_list: '/api/my-favourite-list',
  },
  universe: {
    // Market Universe Management
    category: '/api/all-category',
    types: '/api/all-types',
    distance: '/api/all-distance',
    universe_business_list: '/api/universe-business-profile',
    universe_business_details: '/api/business-profile-details-by-location',
    add_favourite: '/api/profile-add-favourite',
    deals_loyalty_details: '/api/deal-loyalty-details',
    search_business_profile: '/api/search-business-profile',
    deal_loyality_add_favorite:'api/deal-loyalty-add-favourite'
  },
  wallet: {
    // Consumer Wallet Management
    add_wallet: '/api/add-to-my-wallet',
    wallet_list: '/api/my-wallet-list',
    redeem_program: '/api/redeem-program',
    remove_wallet: '/api/remove-from-wallet',
    wallet_count: '/api/add-wallet-count',
    earned_loyalty_points: '/api/earned-loyalty-points',
    remaining_purchase_amount: '/api/',
    last_redeem_loyality:'/api/last-redeemed-loyalty',
    updated_earned_point:'/api/updated-earned-point'
  },
  cms: {
    // Cms Management
    content: '/api/cms-page/', // --> {slug}
  },
  // Community Partner Management
  // Travel Tourism Management
};

// -------------------------------------------------------------------------------

export const MY_HUB_OPTIONS = [
  {
    type: 'My Wallet',
    options: [
      {
        icon: Icons.my_deals,
        title: 'My Deals',
        notify: 0,
        isTab: true,
        page: 'Deals',
      },
      {
        icon: Icons.loyalty_card,
        title: 'My Loyalty Punch Cards',
        notify: 0,
        isTab: true,
        page: 'LoyaltyPunchCards',
      },
      {
        icon: Icons.checkmark_badge,
        title: 'My Badges',
        notify: 0,
        isTab: true,
        page: 'Badges',
      },
    ],
  },
  {
    type: 'Communication and Network',
    options: [
      {
        icon: Icons.inbox,
        title: 'My Inbox',
        page: 'MyInbox',
        isTab: false,
      },
      {
        icon: Icons.user_group,
        title: 'My Smart Family and Friends',
        page: 'SmartFamilyFriends',
        isTab: false,
      },
      {
        icon: Icons.universe,
        title: 'Gimmzi Referral Program',
        isTab: false,
        page: 'ReferralProgram',
      },
    ],
  },
  {
    type: 'My Setting',
    options: [
      {
        icon: Icons.user,
        title: 'Account',
        page: 'MyAccount',
        isTab: false,
      },
      {
        icon: Icons.preference,
        title: 'Preferences',
        page: 'Preferences',
        isTab: false,
      },
      {
        icon: Icons.about,
        title: 'About Gimmzi',
        page: 'AboutGimmzi',
        isTab: false,
      },
    ],
  },
];

export const STORE_DATA = [
  {
    title: 'Wilson’s Grocery Mart',
    rewards: '450 points per month as a resident',
    sub_title: 'Hawthorne at Oleander',
    location: '3529 Adirondack Way - Wilmington, NC 28403',
    bed: '1-3 Beds',
    brand_logo: Images.brand_logo,
    phone: '7478345667',
    images: [Images.img7, Images.img8, Images.img9],
  },
  {
    title: 'Wilson’s Grocery Mart',
    rewards: '350 points per month as a resident',
    sub_title: 'Hawthorne at Oleander',
    location: '24323 Adirondack Way - Wilmington, NC 24323',
    bed: '2-3 Beds',
    brand_logo: Images.brand_logo,
    phone: '7478345667',
    images: [Images.img8, Images.img7, Images.img9],
  },
];

export const ScanGimmziData = [
  {
    title: 'Hawthorne at Oleander',
    address: '3529 Adirondack Woy Wilmington, NC 28403',
    icon: Images.hawthorne,
  },
  {
    title: 'Hawthorne at Oleander',
    address: '3529 Adirondack Woy Wilmington, NC 28403',
    icon: Images.hawthorne,
  },
  {
    title: 'Hawthorne at Oleander',
    address: '3529 Adirondack Woy Wilmington, NC 28403',
    icon: Images.hawthorne,
  },
  {
    title: 'Hawthorne at Oleander',
    address: '3529 Adirondack Woy Wilmington, NC 28403',
    icon: Images.hawthorne,
  },
];

export const GimmziNetworkData = [
  {
    type: 'TravelPartners',
    description:
      'Book your next Trip or Vacation and Earn Points with Gimmzi Travel Partners!',
    icon: Images.img3,
    options: 'Browse Travel Partners',
    status: false,
    disabled: true,
  },
  {
    type: 'DigitalPunchCards',
    description:
      'Earn points with every purchase when you participate in Gimmzi Loyalty Punch Cards.',
    icon: Images.img14,
    options: 'Browse Loyalty Punch Cards',
    status: true,
  },
  {
    type: 'Community',
    description:
      'Looking for an apartment? Earn Monthly points when you sign a lease with an apartment community on the Gimmzi network!',
    icon: Images.img5,
    options: 'Browse Community Partners',
    status: false,
  },
];

export const CommunityDetailsImages = [
  IamgesUri.img7,
  IamgesUri.img8,
  IamgesUri.img9,
  IamgesUri.img10,
  IamgesUri.img11,
  IamgesUri.img12,
  IamgesUri.img13,
  IamgesUri.img10,
  IamgesUri.img11,
  IamgesUri.img8,
  IamgesUri.img9,
  IamgesUri.img12,
  IamgesUri.img13,
];

export const TravelAndTourismImages = [
  IamgesUri.img15,
  IamgesUri.img16,
  IamgesUri.img8,
  IamgesUri.img9,
  IamgesUri.img10,
  IamgesUri.img11,
  IamgesUri.img12,
  IamgesUri.img13,
  IamgesUri.img10,
  IamgesUri.img11,
  IamgesUri.img8,
  IamgesUri.img9,
  IamgesUri.img12,
  IamgesUri.img13,
];

export const ASDATA = [
  {
    title: 'Amenities',
    data: [
      {
        type: 'Pool',
        value: 'Kitchen',
      },
      {
        type: 'Free Wi-Fi',
        value: 'Air Conditionning',
      },
      {
        type: 'Outdoor Space',
        value: 'Ocean View',
      },
    ],
  },
  {
    title: 'Features',
    data: [
      {
        type: 'Pool',
        value: 'Kitchen',
      },
      {
        type: 'Free Wi-Fi',
        value: 'Air Conditionning',
      },
      {
        type: 'Outdoor Space',
        value: 'Ocean View',
      },
    ],
  },
];

export const REVIEW_FOR_LOCATION = [
  {
    title: 'Need to Know',
    description:
      'Please place au linen in the front room by exit door. Also be sure to check underneath beds and tables tor sman belongings b9tore checking out! Enpy your Stay',
  },
  {
    title: 'Announcements',
    description:
      'Topics include Local Specials, Announcements, Upcoming Events, and Need to Know.',
  },
];

export const FavouriteCardList = [
  {
    label: 'iTrip-Oak Island',
    address: '',
    distance: '',
    image: Images.img22,
  },
  {
    label: 'iTrip-Oak Island',
    address: '10 Main Street, Wilmington NC',
    distance: '2.3 mi',
    image: Images.img1,
  },
  {
    label: 'iTrip-Oak Island',
    address: '',
    distance: '',
    image: Images.img21,
  },
];

export const SEARCH_DATA = [
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img1,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 1,
  },
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img24,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 2,
  },
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img9,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 3,
  },
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img7,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 4,
  },
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img1,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 5,
  },
  {
    title: 'Wilson’s Grocery Mart',
    icon: Images.img9,
    address: 'IO Main Street, Wilrnington',
    distance: 'NC • 2.3 mi',
    id: 6,
  },
];

export const INBOX_DATA = [
  {
    name: 'Tammy Jones',
    profile_picture: Images.u1,
    message:
      'Congratulations! You received 50 points from Encore at Westgate Apartments',
    date: '1/20/2024',
  },
  {
    name: 'Taco world',
    profile_picture: Images.u2,
    message: 'A new deal has been added..',
    date: '1/20/2024',
  },
  {
    name: 'Encore Apartments',
    profile_picture: Images.u3,
    message: 'A new loyal rewards program has..',
    date: '1/20/2024',
  },
  {
    name: "Frank's Tires",
    profile_picture: Images.u4,
    message: 'Congratualtions! You received a rec..',
    date: '1/20/2024',
  },
  {
    name: 'Sarah Smith',
    profile_picture: Images.u5,
    message: 'A new message board has been pos..',
    date: '1/20/2024',
  },
];

export const SOCIAL = [
  {
    icon: Icons.facebook,
  },
  {
    icon: Icons.email,
  },
  {
    icon: Icons.linkedin,
  },
  {
    icon: Icons.x,
  },
  {
    icon: Icons.whatsapp,
  },
];

export const MYFF_INFO = [
  'Earn Badge Boosters from community or travel partners.',
  'Accept Badge Boosters from other Gimmzi members.',
  'Send Badge Boosters to new and existing Gimmzi members.',
  'Earn more points when you send Badge Boosters to new members.',
  'Re-gift the gifts you receive',
  'Accept gifts from members',
  'Share, exchange, and earn!',
];

export const OPTIONS = [
  'My List of Family and Friends',
  'My Badge Boosts and Gifts',
];

export const LIST_OPTIONS = ['Send Badge Boosts', 'Send GIFT'];

export const BADGE_BOOSTS_OPTIONS = [
  'Send Now',
  'Accept Badge',
  'Decline Badge',
  'Recind',
  'Resend',
];

export const LIST_MEMBERS = [
  {
    name: 'John Smith',
    status: 'New',
  },
  {
    name: 'Jane Smith',
    status: 'New',
  },
  {
    name: 'Sue Smith',
    status: 'Existing',
  },
  {
    name: 'Joe Smith',
    status: 'Existing',
  },
  {
    name: 'Sarah Smith',
    status: 'Existing',
  },
];

export const BADGE_MEMBERS = [
  {
    provider: 'Allen Park Apartments',
    reward: '1 Badge Booster',
    existing_members: '+15 Pts/Month On Access Badge',
    new_members: '+50 Pts/Month On Access Badge',
    status: 'Sent',
  },
  {
    provider: 'Cambridge Student Housing',
    reward: '1 Badge Booster',
    existing_members: '+15 Pts/Month On Access Badge',
    new_members: '+50 Pts/Month On Access Badge',
    status: 'Accept',
  },
  {
    provider: 'Sunset Place Gardens',
    reward: '1 Badge Booster',
    existing_members: '+15 Pts/Month On Access Badge',
    new_members: '+50 Pts/Month On Access Badge',
    status: 'Declined',
  },
  {
    provider: 'Windfall Lakes Apartment',
    reward: '1 Badge Booster',
    existing_members: '+15 Pts/Month On Access Badge',
    new_members: '+50 Pts/Month On Access Badge',
    status: 'Ready For Use',
  },
  {
    provider: 'Crown Lake Restaurant',
    reward: '1 Badge Booster',
    existing_members: '+15 Pts/Month On Access Badge',
    new_members: '+50 Pts/Month On Access Badge',
    status: 'Declined',
  },
  {
    provider: "Tony's Pizza",
    reward: 'Free Appetizer',
    existing_members: 'Up To A $30 Value',
    new_members: 'Up To A $30 Value',
    status: 'Invite Expired',
  },
];

export const COLOR_EFFECT = [
  {
    status: 'Sent',
    color: '#175CD3',
    stroke: '#B2DDFF',
    background: '#EFF8FF',
  },
  {
    status: 'Accept',
    color: '#067647',
    stroke: '#ABEFC6',
    background: '#ECFDF3',
  },
  {
    status: 'Declined',
    color: '#B54708',
    stroke: '#FEDF89',
    background: '#FFFAEB',
  },
  {
    status: 'Ready For Use',
    color: '#5925DC',
    stroke: '#D9D6FE',
    background: '#F4F3FF',
  },
  {
    status: 'Invite Expired',
    color: '#B42318',
    stroke: '#FECDCA',
    background: '#FEF3F2',
  },
];

export const ReferralData = [
  {
    title: 'Small Business Partner Referrals:',
    content: [
      {
        text: 'Every 5 businesses you sign up on Gimmzi Intro Plan',
        value: '$25',
      },
      {
        text: 'Every 2 businesses you sign up on Gimmzi Boost Plan or higher',
        value: '$100',
      },
    ],
  },
  {
    title: 'Travel Partner Referrals:',
    content: [
      {
        text: 'Every 1 vacation agency and short term rental owner you sign on Essential Plan or higher',
        value: '$100',
      },
      {
        text: 'Every 1 hotel or resort you sign on Essential Plan or Higher',
        value: '$200',
      },
    ],
  },
  {
    title: 'Community Partner Referrals:',
    content: [
      {
        text: 'Every 1 community partner including apartment or student housing, HOA and COA you sign on any plan',
        value: '$200',
      },
    ],
  },
];

export const ReferralProgramData = [
  {
    id: '1',
    title: 'Your Payout Progress',
    description: 'Small Business Partners',
    plans: [
      {
        title: '(Intro Plan):',
        value: '0/0',
      },
      {
        title: 'Expected Payout Amount:',
        value: '$100.00',
      },
      {
        title: 'Expected Payout Date:',
        value: '03/04/2024',
      },
    ],
  },
  {
    id: '2',
    title: 'Your Payout Progress',
    description: 'Small Business Partners',
    plans: [
      {
        title: '(Boost Plan or higher):',
        value: '0/0',
      },
      {
        title: 'Expected Payout Amount:',
        value: '$100.00',
      },
      {
        title: 'Expected Payout Date:',
        value: '03/04/2024',
      },
    ],
  },
  {
    id: '3',
    title: 'Your Payout Progress',
    description: 'Travel Partners (Vacation and STR)',
    plans: [
      {
        title: '(Essential Plan or higher):',
        value: '0/0',
      },
      {
        title: 'Expected Payout Amount:',
        value: '$100.00',
      },
      {
        title: 'Expected Payout Date:',
        value: '03/04/2024',
      },
    ],
  },
  {
    id: '4',
    title: 'Your Payout Progress',
    description: 'Travel  Partners (Hotel or Resort)',
    plans: [
      {
        title: '(Essential Plan or higher):',
        value: '0/0',
      },
      {
        title: 'Expected Payout Amount:',
        value: '$100.00',
      },
      {
        title: 'Expected Payout Date:',
        value: '03/04/2024',
      },
    ],
  },
  {
    id: '5',
    title: 'Your Payout Progress',
    description: 'Community Partners',
    plans: [
      {
        title: '(Any plan):',
        value: '0/0',
      },
      {
        title: 'Expected Payout Amount:',
        value: '$100.00',
      },
      {
        title: 'Expected Payout Date:',
        value: '03/04/2024',
      },
    ],
  },
];

export const Referral_DATA = [
  {
    type: 'Travel',
    name: 'ITrip - Oak Island',
    plan: 'Essential',
    month: '9/18/16',
    month1: 'Month 1',
    month2: 'Month 1',
  },
  {
    type: 'Community',
    name: 'ABC Apartments',
    plan: 'Essential',
    month: '9/18/16',
    month1: 'Month 1',
    month2: 'Month 1',
  },
  {
    type: 'Travel',
    name: 'The Cove',
    plan: 'Essential',
    month: '9/18/16',
    month1: 'Month 1',
    month2: 'Month 1',
  },
  {
    type: 'Small Business',
    name: 'Joe’s Restaurant',
    plan: 'Boost',
    month: '8/15/17',
    month1: 'Month 1',
    month2: 'Month 1',
  },
  {
    type: 'Small Business',
    name: 'Sweet Treats',
    plan: 'Intro',
    month: '8/15/17',
    month1: 'Month 1',
    month2: 'Month 1',
  },
  {
    type: 'Community',
    name: 'Encore at Westgate',
    plan: 'Essential',
    month: '8/15/17',
    month1: 'Month 1',
    month2: 'Month 1',
  },
];

export const loyaltyInfo = [
  'Confirm you are at a participating location below',
  'Show this screen to an associate at checkout',
  `businessName Associate will provide to you or enter their Gimmzi ID and submit below the checkout.`,
];
