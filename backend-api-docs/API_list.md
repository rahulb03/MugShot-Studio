# it contains  the list of all the endpoints - to get mroe details about each endpoint read backendapi.json

---
MugShot Studio
 0.1.0 
OAS 3.1
/api/v1/openapi.json

Authorize
auth


POST
/api/v1/auth/start
Auth Start


POST
/api/v1/auth/signup
Signup


POST
/api/v1/auth/signin
Signin


POST
/api/v1/auth/signin-otp
Signin Otp


POST
/api/v1/auth/verify-otp
Verify Otp


POST
/api/v1/auth/resend-confirmation
Resend Confirmation


POST
/api/v1/auth/forgot-password
Forgot Password


POST
/api/v1/auth/reset-password
Reset Password


GET
/api/v1/auth/check-username/{username}
Check Username Availability


POST
/api/v1/auth/change-password
Change Password



POST
/api/v1/auth/change-email
Change Email



POST
/api/v1/auth/logout
Logout



GET
/api/v1/auth/sessions
Get Sessions



DELETE
/api/v1/auth/sessions/{session_id}
Terminate Session



DELETE
/api/v1/auth/sessions/all
Terminate All Sessions


projects


POST
/api/v1/projects/
Create Project



GET
/api/v1/projects/{project_id}
Get Project



PATCH
/api/v1/projects/{project_id}
Update Project



DELETE
/api/v1/projects/{project_id}
Delete Project



GET
/api/v1/projects/{project_id}/jobs
Get Project Jobs



POST
/api/v1/projects/{project_id}/queue
Queue Generation



POST
/api/v1/projects/queue/process-batch
Process Queue Batch


POST
/api/v1/projects/{project_id}/edit-tool
Apply Edit Tool



PATCH
/api/v1/projects/{project_id}/visibility
Update Project Visibility



GET
/api/v1/projects/gallery/featured
Get Featured Gallery


GET
/api/v1/projects/gallery/trending
Get Trending Gallery


GET
/api/v1/projects/gallery/recent
Get Recent Gallery


GET
/api/v1/projects/user/{user_id}/public
Get User Public Projects



POST
/api/v1/projects/{project_id}/like
Like Project



DELETE
/api/v1/projects/{project_id}/like
Unlike Project



GET
/api/v1/projects/{project_id}/is-liked
Check Project Liked



POST
/api/v1/projects/{project_id}/view
Record Project View



GET
/api/v1/projects/public/{project_id}
Get Public Project



POST
/api/v1/projects/bulk-delete
Bulk Delete Projects


templates


GET
/api/v1/templates/
Get Templates



POST
/api/v1/templates/{template_id}/vote
Vote Template



GET
/api/v1/templates/categories
Get Popular Categories


GET
/api/v1/templates/list
Get All Categories


GET
/api/v1/templates/official
Get Official Templates


GET
/api/v1/templates/{template_id}
Get Template By Id



PATCH
/api/v1/templates/{template_id}
Update Template



DELETE
/api/v1/templates/{template_id}
Delete Template



POST
/api/v1/templates/create
Create Template Directly



POST
/api/v1/templates/sync-official
Sync Official Templates


POST
/api/v1/templates/{project_id}/publish
Publish Template



GET
/api/v1/templates/{template_id}/remixes
Get Template Remixes


POST
/api/v1/templates/{template_id}/remix
Remix Template



POST
/api/v1/templates/{template_id}/upload-thumbnail
Upload Template Thumbnail


comments


GET
/api/v1/comments/template/{template_id}
Get Template Comments



POST
/api/v1/comments/template/{template_id}
Create Comment



DELETE
/api/v1/comments/{comment_id}
Delete Comment


jobs


POST
/api/v1/jobs/
Create Job



GET
/api/v1/jobs/{job_id}
Get Job



GET
/api/v1/jobs/{job_id}/models
Get Available Models


assets


GET
/api/v1/assets/
List Assets



DELETE
/api/v1/assets/{asset_id}
Delete Asset



POST
/api/v1/assets/bulk-delete
Bulk Delete Assets



POST
/api/v1/assets/upload
Upload Asset


chat


POST
/api/v1/chat/new
Create Chat



GET
/api/v1/chat/{chat_id}
Get Chat



GET
/api/v1/chat/{chat_id}/messages
Get Messages



POST
/api/v1/chat/{chat_id}/messages
Send Message


profile


GET
/api/v1/profile/
Get Profile



PUT
/api/v1/profile/
Update Profile



DELETE
/api/v1/profile/
Delete Profile



POST
/api/v1/profile/avatar
Upload Avatar



DELETE
/api/v1/profile/avatar
Delete Avatar


preferences


GET
/api/v1/profile/preferences/
Get Preferences



PUT
/api/v1/profile/preferences/
Update Preferences



PATCH
/api/v1/profile/preferences/{key}
Update Single Preference


users


GET
/api/v1/users/search
Search Users



GET
/api/v1/users/@{username}
Get Public Profile



GET
/api/v1/users/{user_id}
Get Public Profile By Id



POST
/api/v1/users/{user_id}/follow
Follow User



DELETE
/api/v1/users/{user_id}/follow
Unfollow User



GET
/api/v1/users/{user_id}/followers
Get Followers



GET
/api/v1/users/{user_id}/following
Get Following



GET
/api/v1/users/{user_id}/is-following
Check Following Status



POST
/api/v1/users/{user_id}/block
Block User



DELETE
/api/v1/users/{user_id}/block
Unblock User



POST
/api/v1/users/push-token
Register Push Token


billing


GET
/api/v1/billing/plans
Get Plans


GET
/api/v1/billing/current
Get Current Subscription



GET
/api/v1/billing/history
Get Billing History



POST
/api/v1/billing/subscribe
Subscribe



POST
/api/v1/billing/cancel
Cancel Subscription


referral


GET
/api/v1/referral/code
Get Referral Code



POST
/api/v1/referral/apply
Apply Referral Code



GET
/api/v1/referral/stats
Get Referral Stats



GET
/api/v1/referral/rewards
Get Referral Rewards



GET
/api/v1/referral/validate/{code}
Validate Referral Code


GET
/api/v1/referral/referred-users
Get Referred Users


export


POST
/api/v1/export/
Request Data Export



GET
/api/v1/export/status
Get Export Status



GET
/api/v1/export/download
Download Export


support


POST
/api/v1/support/ticket
Submit Support Ticket



POST
/api/v1/support/bug-report
Submit Bug Report



GET
/api/v1/support/tickets
Get My Tickets



GET
/api/v1/support/faq
Get Faq


GET
/api/v1/support/faq/categories
Get Faq Categories

generation


GET
/api/v1/generation/models
List Models



GET
/api/v1/generation/qualities
List Qualities



POST
/api/v1/generation/calculate-credits
Calculate Credits



GET
/api/v1/generation/status
Check Generation Status



POST
/api/v1/generation/enhance-prompt
Enhance Prompt


tools


GET
/api/v1/tools/
List Tools



GET
/api/v1/tools/usage
Get Tool Usage



GET
/api/v1/tools/usage/{tool_id}
Get Single Tool Usage



POST
/api/v1/tools/process
Process With Tool



POST
/api/v1/tools/upload-and-process
Upload And Process


models


GET
/api/v1/models/all
Get All Models Data


GET
/api/v1/models/models
Get Models


GET
/api/v1/models/tools
Get Tools


GET
/api/v1/models/quality-levels
Get Qualities


GET
/api/v1/models/mode-costs
Get Modes

activity


GET
/api/v1/activity/
Get Activity Logs


credits


GET
/api/v1/credits/balance
Get Credit Balance



GET
/api/v1/credits/usage
Get Credit Usage



GET
/api/v1/credits/packages
Get Credit Packages



POST
/api/v1/credits/purchase
Purchase Credits


audio


POST
/api/v1/audio/transcribe
Transcribe Audio


notifications


GET
/api/v1/notifications/
Get Notifications



DELETE
/api/v1/notifications/
Clear All Notifications



POST
/api/v1/notifications/read-all
Mark All Read



PUT
/api/v1/notifications/{notification_id}/read
Mark Read



DELETE
/api/v1/notifications/{notification_id}
Delete Notification


experimental


GET
/api/v1/experimental/settings
Get Experimental Settings



POST
/api/v1/experimental/settings/toggle
Toggle Experimental Features



GET
/api/v1/experimental/api-keys
List Api Keys



POST
/api/v1/experimental/api-keys
Add Api Key



DELETE
/api/v1/experimental/api-keys/{provider}
Delete Api Key



POST
/api/v1/experimental/api-keys/{provider}/validate
Validate Stored Api Key



GET
/api/v1/experimental/providers/{provider}/models
Get Provider Models



POST
/api/v1/experimental/models/import
Import Model



GET
/api/v1/experimental/models/imported
List Imported Models



DELETE
/api/v1/experimental/models/imported/{model_id}
Remove Imported Model


openrouter


GET
/api/v1/openrouter/models
Get Openrouter Models


GET
/api/v1/openrouter/models/imagine
Get Image Generation Models


GET
/api/v1/openrouter/model/{model_id}
Get Model Info


POST
/api/v1/openrouter/generate
Generate Image



GET
/api/v1/openrouter/status
Check Openrouter Status

payments


GET
/api/v1/payments/credit-packs
Get Credit Packs



POST
/api/v1/payments/credit-packs/order
Create Credit Pack Order



POST
/api/v1/payments/credit-packs/verify
Verify Credit Pack Payment



GET
/api/v1/payments/subscription-plans
Get Subscription Plans


POST
/api/v1/payments/subscriptions/order
Create Subscription Order



POST
/api/v1/payments/subscriptions/verify
Verify Subscription Payment



POST
/api/v1/payments/subscriptions/cancel
Cancel Subscription



POST
/api/v1/payments/subscriptions/auto-renew
Toggle Auto Renew



GET
/api/v1/payments/subscriptions/current
Get Current Subscription



GET
/api/v1/payments/billing-history
Get Billing History



POST
/api/v1/payments/billing-history/{transaction_id}/invoice
Generate Invoice



POST
/api/v1/payments/webhooks/razorpay
Razorpay Webhook


GET
/api/v1/payments/test-cards
Get Test Cards



GET
/api/v1/payments/detect-currency
Detect Currency

payment-methods


GET
/api/v1/payment-methods/
Get Payment Methods



DELETE
/api/v1/payment-methods/{method_id}
Delete Payment Method


two-factor


POST
/api/v1/auth/2fa/setup
Setup 2Fa



POST
/api/v1/auth/2fa/enable
Enable 2Fa



POST
/api/v1/auth/2fa/disable
Disable 2Fa



POST
/api/v1/auth/2fa/verify
Verify 2Fa


default


GET
/
Root


GET
/health
Health Check


HEAD
/health
Health Check


GET
/privacy
Privacy Policy


GET
/terms
Terms Conditions


GET
/refund
Refund Policy


GET
/support
Contact Support


GET
/api/health
Api Health Check