---
title: "--dangerously-skip-permissions: What It Does and When I Use It"
description: "What Claude Code's --dangerously-skip-permissions flag disables, what auto mode's classifier catches instead, and the gates I run unattended agents behind."
keywords: claude code dangerously-skip-permissions, claude --dangerously-skip-permissions, claude code bypassPermissions, claude code auto mode, claude code permission modes, run claude code unattended, claude code yolo mode, claude code classifier, claude code hooks permissions, autonomous coding agent safety
date: 2026-09-07
pillar: AI Workflow & Context Engineering
target_query: claude code dangerously-skip-permissions
slug: claude-code-dangerously-skip-permissions
speakable: "Zachary Vorsteg explains what Claude Code's --dangerously-skip-permissions flag disables, how it differs from auto mode's classifier, and the gates, hooks and receipts he runs unattended agents behind across his own ventures."
---

I run Claude Code for hours a day across five businesses, and a lot of that time the agent is working while I am not watching. So I get asked the same question in three different forms: do you use `--dangerously-skip-permissions`, is it safe, and what do you do instead. This post is the long answer, with the numbers Anthropic has published and the scars from my own machine.

The short answer: the flag does exactly what its name says, I use it only inside a container that cannot reach anything I care about, and the reason my agents can work unattended anyway is not a flag. It is a set of gates the agent cannot talk its way past.

## What the flag actually disables

`--dangerously-skip-permissions` starts Claude Code in `bypassPermissions` mode. According to the Claude Code permission-modes documentation, that mode "disables permission prompts and safety checks so tool calls execute immediately, including writes to protected paths" such as `.git` and `.claude` ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)). The same page carries a warning that most people skip: "Only use this mode in isolated environments like containers, VMs, or dev containers without internet access, where Claude Code cannot damage your host system."

Three details from that page matter in practice. The mode refuses to start as root or under `sudo` on Linux and macOS, and prints `--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons`. The first interactive session shows a dialog asking you to accept responsibility for actions taken without checks, and saves your acceptance to user settings. And Claude Code on the web ignores `defaultMode: "bypassPermissions"` from checked-in settings, so a repository cannot start a cloud session in bypass mode ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)).

What it does not skip: the handful of actions no mode auto-approves, and two cross-session messaging safeguards. Everything else, from `git push --force` to `rm -rf` on a path you named, runs the moment the model decides to run it.

## The six modes, side by side

The flag is one end of a spectrum. According to Anthropic's documentation, here is the whole spectrum with what each mode runs without asking (Anthropic, 2026) ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)).

| Mode | What runs without asking | Best for | Protected-path writes |
| --- | --- | --- | --- |
| `default` | Reads only | Reviewing every action | Prompted |
| `acceptEdits` | Reads, file edits, `mkdir`/`mv`/`cp` in the working directory | Iterating on code you are reviewing | Prompted |
| `plan` | Reads, plus classifier-approved commands when auto mode is available | Exploring before changing anything | Routed to the classifier |
| `auto` | Everything, with background safety checks | Long tasks | Routed to the classifier |
| `dontAsk` | Only pre-approved tools | Locked-down CI and scripts | Denied |
| `bypassPermissions` | Everything | Isolated containers and VMs only | Allowed |

The row that changed my workflow is `auto`, not `bypassPermissions`. In auto mode a second model, the classifier, reviews each tool call before it runs and blocks "anything that escalates beyond your request, targets unrecognized infrastructure, or appears driven by hostile content" ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)). If the classifier blocks an action 3 times in a row or 20 times in a session, auto mode pauses and Claude Code goes back to prompting you. Those thresholds are not configurable.

## What the classifier catches, in numbers

Anthropic published the classifier's measured performance in its engineering write-up, "How we built Claude Code auto mode: a safer way to skip permissions." Per Anthropic, users approve 93% of permission prompts, which is the whole argument for automating the review: a prompt you approve 93% of the time is a habit, not a check ([Anthropic, March 25, 2026](https://anthropic.com/engineering/claude-code-auto-mode)).

The evaluation numbers from the same post are the ones to remember. On 10,000 real internal tool calls the full pipeline had a 0.4% false-positive rate, meaning it wrongly blocked 4 in 1,000 benign actions. On 1,000 synthetic data-exfiltration attempts it missed 5.7%. On 52 curated real overeager actions, the kind where the agent does more than you asked, it missed 17% ([Anthropic, March 25, 2026](https://anthropic.com/engineering/claude-code-auto-mode)).

That 17% is the number I plan around. Roughly 1 in 6 genuinely overeager actions get through the classifier. The post is candid that the classifier sees only user messages and the tool-call commands themselves. It does not see Claude's reasoning, tool outputs, or the external content that a prompt injection would ride in on ([Anthropic, March 25, 2026](https://anthropic.com/engineering/claude-code-auto-mode)).

Anthropic's own product post draws the line plainly: "Auto mode reduces risk compared to --dangerously-skip-permissions but doesn't eliminate it entirely, and we continue to recommend using it in isolated environments" ([Anthropic, updated July 10, 2026](https://claude.com/blog/auto-mode)). Auto mode became generally available on July 10, 2026 and, per reports from Help Net Security, the default starting mode for Pro, Max and Team plans on August 14, 2026, with Anthropic citing that teams on auto mode ship about 25% more pull requests ([Help Net Security, August 10, 2026](https://www.helpnetsecurity.com/2026/08/10/anthropic-claude-code-auto-mode/)).

## Why a flag was never going to be my safety model

The threat that keeps me careful is not the agent deciding to delete my home directory. It is the agent reading something that tells it to. Per Simon Willison, the shape of that risk is the "lethal trifecta": an agent that has access to private data, is exposed to untrusted content, and can communicate externally ([Simon Willison, June 16, 2025](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)). My agents read my email, scrape listing sites, and post to social accounts. That is all three legs on one machine.

According to OWASP, prompt injection is LLM01, the first entry in its Top 10 for LLM Applications, and splits it into direct injection, where the user's own prompt changes behavior, and indirect injection, where content from a web page or file does ([OWASP, 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)). The classifier is built to catch the second kind, and the 5.7% miss rate on synthetic exfiltration is a real improvement over nothing. It is still a miss rate.

So the question I actually answer is not "prompt or no prompt." It is: which actions can this agent take that I cannot undo, and what stands between it and those actions besides its own judgment?

## The gates I run unattended agents behind

I wrote up the general method in [agentic engineering patterns](https://zacharyvorsteg.com/blog/agentic-engineering-patterns/). This is the specific machinery, as it exists on my Mac today.

**Approval boundaries in the operating contract.** Every agent on my machine reads one file that separates what it may do freely from what needs my explicit, action-specific yes. Reading, searching, editing inside the project, running existing tests and building drafts are free. Sending to anyone but me, deploying to production, pushing, paying, deleting, force-pushing, rotating credentials and touching launchd all require a yes, and a yes for one action never carries to the next. This is a text rule, so on its own it is the weakest layer. It is also the one that shapes everything the agent proposes.

**Hard gates in the tool path.** The bots that run while I sleep do not call `git push` or an ad platform directly. They call typed tools with an installed policy in front of them. On September 5 I discovered that policy had three layers, not one, and that the second layer had been silently denying every blog publish across 15 sites for 20 hours while the agents reported "independent factual review required." That was a bug, and a useful one: a gate that fails closed is annoying, a gate that fails open is a headline.

**Receipts, not reports.** Nothing counts as done because an agent said so. A blog post is verified by fetching the live URL. A video is verified by a gate that re-reads its manifest, scene-detects the cuts and measures loudness. Today that gate re-checked 11 videos in 52 minutes after a code change, and two of them failed on a 22-pixel jump nobody would have caught by eye. I covered why this matters in [what breaks when you automate everything](https://zacharyvorsteg.com/blog/what-breaks-when-you-automate-everything/).

**A never-twice registry.** Every incident becomes an executable assertion that runs on a schedule. Right now that registry holds 16 assertions.

## Two incidents that a flag would not have prevented

Both of these happened in one week in September, both with agents running in modes far more restrictive than bypass.

An agent cleaning up blog templates hit a rejected push and ran `git push --force-with-lease` three times. Its clone had never fetched the commits a different agent had pushed from a throwaway worktree, so the lease was satisfied and production history lost 4 published posts, one of them published that afternoon. Every template checker still reported 38 of 38 checks passing, because they measured the template, not the content. I recovered the posts from dangling commits and the registry gained an assertion that fails on any force push.

A second agent ran `netlify deploy --prod` from a working copy that was 6 commits behind `origin/main`, silently reverting a post and four SEO fixes that another process had shipped the day before. The CLI uploads whatever is on disk. Nothing about permission prompts would have flagged either action, because in both cases the agent was allowed to run the command. The problem was that the command was wrong, and the only thing that catches a wrong-but-allowed command is a check that knows what right looks like.

I go into how I keep agents fed with the right state in [context engineering for AI agents](https://zacharyvorsteg.com/blog/context-engineering-ai-agents/), because half of these failures are missing context, not missing permission.

## When I do use the flag

There are two legitimate uses on my machine, and both match the documentation's own example: "Run fully unattended inside a container: `claude -p "<prompt>" --dangerously-skip-permissions`" ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)).

The first is a dev container with no network and a throwaway checkout, for batch jobs like regenerating 300 formula videos where every prompt would be the same click. The dev container configuration runs Claude Code as a non-root user, which is why the root check does not trip ([Anthropic, 2026](https://code.claude.com/docs/en/devcontainer)). The second is a headless run in CI, and there I usually prefer `dontAsk` with an exact `--allowedTools` list, because a CI job that can do anything is a CI job I have not scoped.

On my actual workstation, the one with my email, my brokerage files and my clients' ad accounts, the flag never runs. Auto mode does, all day, and it has blocked me. Earlier today it denied a command of mine because the command touched an environment file, which was the right call and cost me about 30 seconds. That trade is the whole point.

## A decision table you can copy

| Situation | Mode I use | Extra gate |
| --- | --- | --- |
| Interactive work on my workstation | `auto` | Approval boundaries in the operating contract; hooks on `PreToolUse` |
| Unattended bots on live accounts | Typed tools behind an installed policy | Fail-closed policy, receipts, never-twice registry |
| Batch job in a network-less dev container | `bypassPermissions` | Throwaway checkout, nothing to lose |
| CI with a known command list | `dontAsk` + `--allowedTools` | The allowlist is the gate |
| Exploring an unfamiliar repo | `plan` | Read-only by construction |

Two documentation details make this table safer than it looks. Hooks cannot bypass deny or ask rules: a `PreToolUse` hook that returns "allow" still hits a matching deny rule, and a matching ask rule still prompts ([Anthropic, 2026](https://code.claude.com/docs/en/permissions)). And on entering auto mode, blanket allow rules that grant arbitrary code execution, like `Bash(*)`, are dropped, so an old permissive settings file does not quietly widen what the classifier lets through ([Anthropic, 2026](https://code.claude.com/docs/en/permission-modes)).

## What I would tell a founder about to type it

If the machine holds anything you cannot regenerate, do not use the flag on it. Use auto mode, which is now the default anyway, and spend the hour you save building one receipt: a script that proves the thing the agent claims to have done. Then put the actions you truly cannot undo behind a tool the agent has to call, with a policy in front of it that says no by default.

The flag is not evil. It is honest about what it removes. The mistake is believing that the prompts were what kept you safe. The prompts were a habit you approved 93% of the time, per Anthropic's own measurement ([Anthropic, March 25, 2026](https://anthropic.com/engineering/claude-code-auto-mode)). The thing that keeps you safe is knowing which 7% you would have stopped, and building that into something the agent cannot argue with.

I run all of this as a one-person company, and I wrote up the rest of the stack in [my solo founder automation stack](https://zacharyvorsteg.com/blog/my-solo-founder-automation-stack/).

## Frequently asked questions

### Is --dangerously-skip-permissions the same as auto mode?

No. Bypass mode disables prompts and safety checks entirely, including writes to protected paths like `.git`. Auto mode keeps a classifier in the loop that reviews each tool call and falls back to prompting after 3 consecutive blocks or 20 total. Anthropic describes auto mode as "a middle path" that introduces less risk than skipping all permissions ([Anthropic, updated July 10, 2026](https://claude.com/blog/auto-mode)).

### Can I turn the flag off for my whole team?

Yes. Setting `permissions.disableBypassPermissionsMode` to `"disable"` in a managed settings file removes bypass mode, and `disableAutoMode` does the same for auto mode. A user can also set it in their own settings to lock themselves out ([Anthropic, 2026](https://code.claude.com/docs/en/permissions)).

### Does the classifier see the web pages my agent reads?

No. Per Anthropic's engineering write-up, the classifier sees user messages and the tool-call commands only; it strips assistant prose, tool outputs and external content ([Anthropic, March 25, 2026](https://anthropic.com/engineering/claude-code-auto-mode)). That is why I treat every fetched page as untrusted input and keep the actions that matter behind separate gates.

### What should I build first if I want agents working unattended?

A receipt. Pick the one action you most rely on the agent for, and write a script that independently proves it happened: fetch the live URL, query the database, diff the deployed file set. Everything else in this post grows from having a check the agent cannot satisfy by describing its own work.

Building something similar and want a second set of eyes on the gates? [Reach out](https://zacharyvorsteg.com/#contact), or see the ventures at https://zacharyvorsteg.com/#ventures.

<!-- content-artifact-sha256: 18aa7528e6710d143d8a7e57d85f00f5ae7197343408fa07e75d5198675ea803 -->
