# NextCargo - Product Requirements Document

A comprehensive cargo logistics platform connecting Azerbaijani customers with Polish market vendors (Allegro.pl, Amazon.pl, IKEA.pl, Maktrans.pl), enabling order placement to warehouse and delivery tracking.

**Experience Qualities:**
1. **Trustworthy** - Users need confidence their cargo is being tracked accurately with transparent status updates
2. **Efficient** - Quick access to order information and streamlined communication with support
3. **Professional** - Clean, organized interface that reflects the reliability of the logistics service

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple user roles (customer, admin) with distinct interfaces
- Order management with status tracking
- Real-time support messaging system
- External marketplace links for order placement
- **Backend**: Firebase Authentication + Firestore Database for production-ready data persistence

## Essential Features

### 1. Unified Authentication System
- **Functionality**: Single login form for both users (FIN code) and admin (username/password)
- **Purpose**: Streamlined access for customers and administrators through one interface
- **Trigger**: App launch or logout
- **Progression**: Enter credentials → Check admin credentials first → If not admin, validate FIN format → Authenticate via Firebase → Load user data from Firestore → Navigate to appropriate interface
- **Success criteria**: Users can register/login with FIN code; admin can login with secure credentials (CRG_ADMIN_PL2024 / Crg0!Plnd#Az2024$SecureAdmin!); seamless switching between user and admin interfaces; Firebase Authentication handles password encryption and security

### 2. Order List Dashboard with Tracking History
- **Functionality**: Scrollable list of user's cargo orders with status indicators and detailed tracking timeline
- **Purpose**: Provide at-a-glance overview of all shipments with complete historical tracking information
- **Trigger**: Successful login, tab navigation
- **Progression**: Load user orders → Display cards with tracking info → Tap order → Show detailed modal with tabs → View details or tracking history timeline → See chronological events with timestamps and locations
- **Success criteria**: Orders display with clear status (In Transit/At Warehouse/Delivered), sorted by date, detail view shows full tracking info, tracking history tab displays timeline of all status changes with timestamps, locations, and admin notes; timeline animates smoothly and shows latest event prominently

### 3. Marketplace Links Hub
- **Functionality**: Curated list of Polish e-commerce platforms
- **Purpose**: Direct customers to partner marketplaces for purchasing
- **Trigger**: "Apps" tab selection
- **Progression**: Navigate to Apps tab → Display marketplace cards → Tap card → Open external link
- **Success criteria**: Links to Allegro.pl, Amazon.pl, IKEA.pl, Maktrans.pl open correctly with visual branding

### 4. Support Messaging System
- **Functionality**: Bidirectional chat between customers and admin
- **Purpose**: Enable customer service inquiries and issue resolution
- **Trigger**: Support tab selection or help button
- **Progression**: Open support → View message history → Type message → Send → Admin receives → Admin replies → User sees response
- **Success criteria**: Messages persist, display timestamps, show sender, admin can view all conversations

### 5. User Profile Management
- **Functionality**: Display and edit user information
- **Purpose**: Allow users to view/update their account details
- **Trigger**: Profile tab selection
- **Progression**: View profile → Display name, surname, FIN → Edit button → Modify fields → Save → Update stored data
- **Success criteria**: Profile displays current user data, changes persist across sessions

### 6. Admin Panel with Tracking Event Management
- **Functionality**: Comprehensive order management dashboard with user search and automatic tracking history creation
- **Purpose**: Enable logistics team to track, update, and manage all cargo shipments with full audit trail
- **Trigger**: Admin login through main login form with secure credentials
- **Progression**: Enter admin username/password → Access admin dashboard → View all orders from Firestore → Search users by name/FIN → Select order → Update status in Firestore → Automatic tracking event created → Send notification → Customer sees real-time update with tracking history
- **Success criteria**: Admin can login through unified form, view all orders from database, search/filter users, change statuses with Firestore sync, add/remove orders, send push notifications to customers; each status change automatically creates a tracking event with timestamp, location, description, and admin attribution; tracking history is fully auditable and visible to customers

### 7. Push Notifications
- **Functionality**: In-app alerts for order status changes
- **Purpose**: Keep customers informed of shipment progress
- **Trigger**: Admin updates order status
- **Progression**: Status change → Generate notification → Store in user's notification list → Display badge → User views → Mark read
- **Success criteria**: Notifications appear immediately, persist until read, display clear messages

## Edge Case Handling
- **Invalid FIN Code**: Real-time validation with format checking (7 characters Azerbaijani FIN format), error messages guide correction
- **Admin vs User Login**: System automatically detects admin credentials and routes to admin panel, otherwise validates as FIN code via Firestore
- **Empty States**: Friendly messages when no orders exist, support history is empty, or notifications are cleared
- **Network Operations**: Loading states during Firebase operations, proper error handling for network failures, automatic retry logic
- **Admin Security**: Complex hardcoded credentials for initial admin check; Firebase Security Rules enforce admin-only operations; isAdmin flag in Firestore user document
- **Duplicate Orders**: Validation prevents creating orders with identical tracking numbers
- **Concurrent Edits**: Firebase handles consistency with server-side timestamps; clients receive real-time updates via Firestore listeners
- **Offline Support**: Firebase SDK provides offline persistence; changes sync when connection restored
- **Authentication State**: Persistent login via Firebase Auth; automatic token refresh; auth state listeners maintain session

## Design Direction
The design should feel professional and trustworthy like enterprise logistics software, while remaining approachable for everyday consumers. A clean, minimal interface emphasizes clarity and functionality over decoration, using organized card layouts and clear typography to communicate order status at a glance.

## Color Selection
Custom palette - Professional logistics theme with status-oriented colors

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Represents reliability, trust, and professionalism in logistics
- **Secondary Colors**: 
  - Slate Gray (oklch(0.55 0.02 250)) - Supporting UI elements, backgrounds
  - Light Blue (oklch(0.85 0.08 250)) - Hover states, secondary actions
- **Accent Color**: Vibrant Orange (oklch(0.65 0.18 40)) - Call-to-action buttons, important highlights, draws attention to primary actions
- **Status Colors**:
  - In Transit: Amber (oklch(0.70 0.15 85)) - Active, moving
  - At Warehouse: Blue (oklch(0.55 0.15 250)) - Stable, waiting
  - Delivered: Green (oklch(0.60 0.15 145)) - Complete, success
- **Foreground/Background Pairings**:
  - Background (White oklch(0.98 0 0)): Dark text (oklch(0.25 0.02 250)) - Ratio 13.2:1 ✓
  - Card (Light Gray oklch(0.96 0.01 250)): Dark text (oklch(0.25 0.02 250)) - Ratio 12.5:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(0.98 0 0)) - Ratio 8.1:1 ✓
  - Secondary (Slate Gray oklch(0.55 0.02 250)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Accent (Vibrant Orange oklch(0.65 0.18 40)): White text (oklch(0.98 0 0)) - Ratio 4.8:1 ✓
  - Muted (Light Gray oklch(0.92 0.01 250)): Medium text (oklch(0.45 0.02 250)) - Ratio 6.1:1 ✓

## Font Selection
The typography should convey clarity and professionalism, using a modern sans-serif that remains highly legible across order details and tracking information. Inter provides excellent readability at all sizes and maintains a professional, neutral character appropriate for logistics.

- **Typographic Hierarchy**:
  - H1 (Screen Titles): Inter Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Inter SemiBold/24px/tight letter spacing/-0.01em  
  - H3 (Card Titles): Inter SemiBold/18px/normal spacing
  - Body (Order Details): Inter Regular/16px/relaxed leading/1.6
  - Small (Status Labels): Inter Medium/14px/normal spacing
  - Caption (Timestamps): Inter Regular/12px/loose spacing/0.01em

## Animations
Animations should feel purposeful and professional, reinforcing the sense of a reliable system. Subtle transitions provide feedback without slowing the user down, with slightly more pronounced animations for status changes to celebrate delivery milestones.

- **Purposeful Meaning**: Smooth card expansions when viewing order details convey revealing hidden information; status badge color transitions emphasize progress; tab switching uses horizontal slides to maintain spatial orientation
- **Hierarchy of Movement**: 
  - Critical: Status change animations (300ms spring) celebrate delivery milestones
  - Important: Order card taps (200ms ease) provide immediate feedback
  - Subtle: Tab navigation (250ms ease), list scrolling momentum
  - Minimal: Hover states (150ms), input focus (100ms)

## Component Selection

- **Components**: 
  - `Card` - Order items, marketplace links, profile sections
  - `Badge` - Status indicators (In Transit/Warehouse/Delivered)
  - `Button` - Primary actions, form submissions, styled with `variant="default"` for main actions
  - `Input` - Form fields for registration/login with labels
  - `Tabs` - Bottom navigation bar (Orders, Support, Profile, Apps)
  - `Dialog` - Order details modal, admin order management
  - `ScrollArea` - Order list, support messages, admin panel
  - `Table` - Admin panel order overview
  - `Avatar` - User profile display
  - `Separator` - Visual dividers between sections
  - `Alert` - Error messages, empty states

- **Customizations**:
  - Status badges with custom colors mapped to order states
  - Bottom tab bar with fixed positioning and icon integration
  - Admin login form with distinct styling from user auth
  - Support message bubbles (custom component) with sender differentiation
  - Marketplace cards with external link icons

- **States**:
  - Buttons: Default (solid primary), Hover (slightly lighter), Active (pressed inset), Disabled (muted gray)
  - Inputs: Default (border), Focus (primary border + ring), Error (destructive border), Filled (subtle background)
  - Order Cards: Default (elevated shadow), Hover (increased shadow), Selected (primary border)
  - Status Badges: Dynamic colors with subtle pulse animation for "In Transit"

- **Icon Selection** (Phosphor Icons):
  - Package (Package) - Orders tab, order items
  - ChatCircle (ChatCircle) - Support tab
  - User (User) - Profile tab
  - AppWindow (AppWindow) - Apps/marketplace tab
  - MagnifyingGlass (MagnifyingGlass) - Admin search
  - Bell (Bell) - Notifications
  - SignOut (SignOut) - Logout
  - PaperPlane (PaperPlaneRight) - Send message
  - Plus (Plus) - Add order (admin)
  - Pencil (PencilSimple) - Edit order/status

- **Spacing**:
  - Screen padding: `p-6` (24px)
  - Card padding: `p-4` (16px)
  - Stack spacing: `gap-4` (16px between elements)
  - Section gaps: `gap-6` (24px between major sections)
  - Input spacing: `gap-2` (8px label to input)
  - Button padding: `px-6 py-3` (24px/12px)

- **Mobile**:
  - Bottom tab bar sticky at viewport bottom with safe-area padding
  - Order cards stack vertically with full-width touch targets
  - Admin panel switches to card view on mobile (<768px)
  - Support messages optimize for single-column chat interface
  - Profile sections collapse into single column
  - Marketplace grid switches from 2-column to 1-column on mobile
  - All interactive elements minimum 44px touch targets
