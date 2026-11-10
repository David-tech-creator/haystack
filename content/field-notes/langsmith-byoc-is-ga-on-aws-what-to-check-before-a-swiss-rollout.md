---
title: LangSmith BYOC is GA on AWS: what to check before a Swiss rollout
date: 2026-11-10
summary: LangSmith BYOC is GA on AWS, with Azure and GCP in beta. Your traces and evals stay in your cloud account, but LangChain still runs the control plane, and neither post mentions Swiss regions.
---

**The short version**

- LangSmith BYOC has been GA on AWS since August 12, 2026, Enterprise plan only. Azure and Google Cloud have been in beta since November 3.
- Traces, prompts, datasets and deployments live in your cloud account. Auth, config, billing metadata and telemetry still go through LangChain's control plane.
- Before the security review, ask sales for the region list, where the control plane is hosted, and whether you get a dedicated VPC or your existing one.

![Image from LangChain blog: LangSmith BYOC is now available on AWS, Azure, and Google Cloud](/field-notes/langsmith-byoc-is-ga-on-aws-what-to-check-before-a-swiss-rollout.png)

*Image: [LangChain blog](https://www.langchain.com/blog/langsmith-byoc-aws-gc-azure)*

LangChain made LangSmith BYOC generally available on AWS on [August 12, 2026](https://www.langchain.com/blog/langsmith-byoc-is-now-generally-available-on-aws). On [November 3](https://www.langchain.com/blog/langsmith-byoc-aws-gc-azure) it added Azure and Google Cloud, both in beta. If you run agents inside a customer's systems, the offer is easy to state. Traces, prompts, datasets, experiments, agent deployments and workspace secrets sit in the customer's own cloud account, and LangChain handles patching, scaling, backups and upgrades.

For Swiss field work, the important question is what "your account" actually covers.

## What still lives with LangChain

LangChain runs the control plane. That covers auth, org and workspace config, billing and usage metadata, hashed API keys, user management and the frontend. The AWS post says the control plane "does not hold sensitive application data." The data plane holds everything else: evaluators, Insights runs, annotation queues and sandboxes.

On Google Cloud, data planes are managed from LangSmith's US control plane at launch. Neither post says where the control plane sits for AWS or Azure. Telemetry also goes from the data plane to the control plane. A Swiss legal team will want to know whether that telemetry can include project names or user identifiers. The data plane belonging to the customer is no reason to skip the cross-border transfer analysis.

## The region question

Neither post mentions Switzerland, a Zurich region, nDSG or FINMA. AWS BYOC runs in 15 regions across the US, EU and APAC, and the posts do not list them. I would not assume Zurich is one of them. The Azure section gives no region detail at all.

Google Cloud is the one clear answer. At launch, its data planes "can run in any region," managed from that US control plane. Provisioning on all three clouds starts with a call to sales, and that call is where you get the AWS and Azure lists.

One useful detail: an organization can run several data planes, each in its own account and region. Production and staging can sit in separate AWS accounts, with an Azure deployment alongside them.

## What the security review will read

On AWS, the customer applies a [Terraform module](https://www.langchain.com/blog/langsmith-byoc-is-now-generally-available-on-aws) that creates an IAM role. LangChain's Crossplane then assumes that role to provision the VPC, EKS, databases, storage and ingress. Where AWS allows it, the role is limited to resources tagged `managed_by=langsmith` and to specific name prefixes. It has no data-read permissions:

```
no s3:GetObject on the trace bucket
no rds-db:connect to PostgreSQL
no elasticache:Connect to Redis
```

That role still creates and changes infrastructure in a client's account, so expect questions about change control and what "customer-approved" support access looks like in practice. Some of the answers are in the posts:

- Traffic between the planes runs over PrivateLink.
- The EKS cluster has no public endpoint and no public node IPs.
- EKS audit logs go to CloudWatch in the customer's account.
- VPC flow logs go to an S3 bucket the customer owns.

The posts disagree on one point. The August post describes a dedicated VPC. The November post says BYOC runs "inside your existing VPC, with the database in subnets you choose," and lets you attach your own security groups. That changes your IP planning and egress inspection, so ask which one your deployment gets.

## Beta is beta

On Azure, the data plane runs in a dedicated VNet with a private AKS endpoint, Istio and KEDA installed via Helm, and Azure Monitor for telemetry. On GCP, resources use namespace-scoped names so they don't collide with existing infrastructure. Trace migration from self-hosted is available on AWS today; the post doesn't say when it reaches Azure or GCP. The open-source migration tool covers users, datasets, prompts and dashboards on every cloud.

The posts give no SLA and no support terms for either beta, and no region list for Azure. I would keep regulated production workloads off them for now.

## The costs the posts leave out

EKS, multi-AZ RDS, ElastiCache and the S3 trace storage all run in your account, so they presumably bill to you. Neither post gives pricing or sizing. The November post says teams "no longer plan maintenance windows or manage Helm upgrades," which also means the customer's change process doesn't decide when upgrades land. And the benefits are measured against self-hosting. For many teams the real alternative is a plain SaaS tenancy.

The LLM Gateway connects to 11 providers plus any OpenAI- or Anthropic-compatible endpoint. Inside a locked-down network, someone still has to open that egress path.

## What I would do on Monday

- Ask sales for the 15 AWS regions, the Azure regions, and where the control plane is hosted.
- Ask whether you get a dedicated VPC or your existing one.
- Get a written list of the telemetry fields sent to the control plane.
- Read the Terraform module with the client's cloud team before anyone applies it.

If Zurich isn't on the region list for your cloud, the rest of the review can wait until it is.

## Sources

- [LangSmith BYOC is now available on AWS, Azure, and Google Cloud](https://www.langchain.com/blog/langsmith-byoc-aws-gc-azure), LangChain blog
- [LangSmith BYOC on AWS is generally available](https://www.langchain.com/blog/langsmith-byoc-is-now-generally-available-on-aws), LangChain blog
