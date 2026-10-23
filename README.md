# SKIPTIDE downloads

Public Android and Windows playtest downloads: **https://gdjadenchoi.github.io/skiptide-downloads/**

The page reads public GitHub Releases and selects the newest published release with an uploaded APK, including prereleases. Publish each new build with `SKIPTIDE.apk` and, when available, `SKIPTIDE-Windows.zip`. The Android button and update notes refresh when visitors open the page. The Windows button updates only when that same release contains its uploaded Windows ZIP; otherwise it retains the verified fallback. No website edit is needed for each release.

If GitHub's API is unavailable, rate limited, or returns a stale release list older than the fallback, the page keeps the verified v1.15 Android and Windows downloads and offers a link to the full release list. It does not install updates automatically. Publish this fallback only after both v1.15 release assets have been uploaded and verified.

The Windows ZIP includes the game and the silent learning bot from v1.13. Extract the entire ZIP before running `SKIP.exe`. `Bot/RunLearningBot.cmd` simulates 30 fresh games for 20 modeled minutes each; `Bot/RunLearningBot-Long.cmd` simulates 6 games for 120 modeled minutes each. These are accelerated simulations, not measured human play sessions. Bot saves are separate from normal game saves, and the bot does not upload logs. Its evidence ZIP is written under `%LOCALAPPDATA%\SKIPTIDE\BotRuns` for manual sharing in the development conversation.

GitHub Pages source: `codex/download-page`, repository root. Site changes pushed to this branch redeploy the page.

The screenshot is from SKIPTIDE. Galmuri font licensing is included in `assets/Galmuri-LICENSE.txt`.
