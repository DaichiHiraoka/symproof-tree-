# symproof-tree Specification

## Project Overview

**symproof-tree** is a learning traceability platform demo showcasing Symbol blockchain technology for an internship application. The system combines web learning tracking with blockchain-based proof generation for employment portfolios.

### Core Value Proposition
- **Automatic learning detection** - No manual input required, system captures browsing activity
- **Objective tracking** - User cannot edit auto-generated data, ensuring authenticity
- **Tamper-proof records** stored on Symbol blockchain
- **AI-powered summarization** using Claude API for human-readable insights
- **Verifiable portfolio** for job applications with third-party verification
- **Visual learning tree** showing knowledge progression and prerequisites

### Key Differentiators
1. **Automatic vs Manual**: Unlike traditional portfolios, data is captured automatically without user bias
2. **Blockchain Proof**: Every record is cryptographically verified on Symbol network
3. **No Editing Policy**: Maintains objectivity by preventing post-hoc modifications
4. **Instant Verification**: Employers can verify authenticity in seconds

### Target Demo Duration
2-3 weeks for MVP implementation

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Visualization**: React Flow (learning tree)
- **State Management**: React Hooks (useState, useContext)

### Blockchain
- **Network**: Symbol Testnet
- **SDK**: symbol-sdk v3
- **Node URL**: https://sym-test-03.opening-line.jp:3001
- **Network Type**: TESTNET
- **Transaction Types**:
  - TransferTransaction (learning records)
  - AggregateTransaction (batch records)

### AI Integration
- **API**: Google Gemini API
- **Model**: gemini-1.5-flash
- **Use Case**: Learning record summarization

### Storage
- **Off-chain**: localStorage (browser-based)
- **On-chain**: Symbol blockchain (metadata only)
- **Development**: Mock JSON data

---

## Architecture

```
Mock Browsing Data (JSON)
    ↓
Auto-Detection Logic
    ↓
Pending Records (LocalStorage)
    ↓
User Confirmation (Read-only Review)
    ↓
Next.js Frontend (React + TypeScript)
    ↓ ↙ ↘
Symbol SDK    Gemini API    LocalStorage
    ↓              ↓             ↓
Symbol Testnet   AI Summary   Confirmed Records
```

**Key Data Flow**:
1. System loads mock browsing sessions (simulates browser extension)
2. Auto-detection converts sessions to learning records
3. Records appear in "Pending" queue (read-only for user)
4. User reviews and confirms records (no editing)
5. Confirmed records trigger:
   - Blockchain transaction (Symbol)
   - AI summarization (Gemini)
   - Portfolio update (LocalStorage)

### Directory Structure

```
symproof-tree/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home: Pending & Confirmed records
│   │   ├── tree/page.tsx               # Learning tree visualization
│   │   ├── portfolio/[id]/page.tsx     # Portfolio sharing page
│   │   ├── verify/page.tsx             # Proof verification page
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── PendingRecords.tsx          # Auto-detected pending records list
│   │   ├── ConfirmedRecords.tsx        # Blockchain-confirmed records list
│   │   ├── ConfirmationModal.tsx       # Record review & confirmation modal
│   │   ├── LearningTree.tsx            # Tree visualization (React Flow)
│   │   ├── RecordCard.tsx              # Individual record card (read-only)
│   │   ├── ProofCard.tsx               # Blockchain proof display
│   │   ├── VerifyPanel.tsx             # Verification UI
│   │   └── Header.tsx                  # Navigation header
│   ├── lib/
│   │   ├── detection/
│   │   │   ├── auto-tracker.ts         # Convert browsing sessions to records
│   │   │   ├── score-calculator.ts     # Calculate understanding scores
│   │   │   └── tag-extractor.ts        # Extract tags from URLs
│   │   ├── symbol/
│   │   │   ├── client.ts               # Symbol SDK initialization
│   │   │   ├── transaction.ts          # Transaction creation
│   │   │   ├── verify.ts               # Verification logic
│   │   │   └── types.ts                # Symbol-specific types
│   │   ├── ai/
│   │   │   └── summarize.ts            # Gemini API integration
│   │   ├── storage/
│   │   │   └── local.ts                # LocalStorage operations
│   │   └── utils/
│   │       ├── hash.ts                 # SHA-256 hashing
│   │       └── validation.ts           # Data validation
│   ├── types/
│   │   └── index.ts                    # Global type definitions
│   └── constants/
│       └── index.ts                    # App constants
├── public/
│   ├── mock-browsing-sessions.json     # Sample browsing data for demo
│   └── mock-confirmed-records.json     # Pre-confirmed records for tree
├── .env.local                          # Environment variables
├── .env.example                        # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Data Models

### BrowsingSession (Mock Data Input)

```typescript
interface BrowsingSession {
  id: string;                           // Session identifier
  url: string;                          // Visited URL
  title: string;                        // Page title
  startTime: string;                    // ISO8601 start timestamp
  endTime: string;                      // ISO8601 end timestamp
  scrollDepth: number;                  // Percentage scrolled (0-100)
  revisits: number;                     // Number of times revisited
  domain: string;                       // Domain name (e.g., "nextjs.org")
  category: string;                     // Auto-categorized topic
}
```

### LearningRecord (Core Entity)

```typescript
interface LearningRecord {
  // Identity
  id: string;                           // UUID v4
  userId: string;                       // Symbol address or session ID
  
  // Content
  url: string;                          // Learning resource URL
  title: string;                        // Resource title
  description?: string;                 // Optional description
  tags: string[];                       // Categories/topics
  
  // Metrics
  duration: number;                     // Learning duration in minutes
  understanding: 1 | 2 | 3 | 4 | 5;     // Self-rated understanding (1=poor, 5=excellent)
  note: string;                         // Personal notes
  
  // Timestamps
  createdAt: string;                    // ISO8601 format
  updatedAt?: string;                   // ISO8601 format
  
  // Blockchain Proof
  contentHash: string;                  // SHA-256 of record content
  txHash?: string;                      // Symbol transaction hash
  blockHeight?: number;                 // Block number
  proofStatus: 'pending' | 'confirmed' | 'failed'; // Transaction status
  
  // AI Generated
  aiSummary?: string;                   // Gemini-generated summary
  summaryStatus: 'none' | 'generating' | 'ready' | 'failed';
}
```

### LearningNode (Tree Visualization)

```typescript
interface LearningNode {
  id: string;                           // Matches LearningRecord.id
  recordId: string;                     // Reference to LearningRecord
  
  // Position
  position: {
    x: number;
    y: number;
  };
  
  // Relationships
  prerequisites: string[];              // Array of prerequisite node IDs
  dependents: string[];                 // Nodes that depend on this
  
  // Status
  status: 'completed' | 'in-progress' | 'locked';
  completedAt?: string;                 // ISO8601
}
```

### Portfolio (User Profile)

```typescript
interface Portfolio {
  userId: string;                       // Symbol address
  displayName?: string;                 // Optional username
  
  // Content
  records: LearningRecord[];
  treeData: LearningNode[];
  
  // Metadata
  summary: string;                      // Overall learning summary (AI-generated)
  stats: {
    totalRecords: number;
    totalDuration: number;              // Total minutes
    averageUnderstanding: number;       // Average score
    topTags: string[];                  // Most used tags
  };
  
  // Sharing
  publicUrl: string;                    // Shareable URL
  isPublic: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### SymbolTransaction (Blockchain Format)

```typescript
interface SymbolTransactionPayload {
  type: 'learning_record';
  version: '1.0';
  id: string;                           // Record ID
  contentHash: string;                  // SHA-256 of record
  timestamp: string;                    // ISO8601
  metadata: {
    title: string;
    duration: number;
    understanding: number;
    tags: string[];
  };
}
```

---

## Feature Specifications

### Feature 1: Automatic Learning Record Detection & Confirmation ⭐ CRITICAL

**Purpose**: Automatically capture learning activities and allow users to confirm before creating blockchain proofs.

**Key Principle**: 
- **System generates** all learning data automatically
- **User only confirms** (no editing allowed)
- **Demo implementation**: Mock automatic detection with pre-generated data

**UI Components**:
- **Pending Records List**:
  - Auto-detected learning sessions
  - Display: URL, Title, Duration, Estimated Understanding, Auto-generated Tags
  - Status badge: "Pending Confirmation"
  - Each record shows: Preview card with all details (read-only)
  
- **Confirmation Panel**:
  - Selected record details (expanded view)
  - Calculated content hash (displayed for transparency)
  - Action button: "ブロックチェーンに記録する" (Record to Blockchain)
  - Warning: "記録後は変更できません" (Cannot be modified after recording)

- **No Edit Controls**:
  - All fields are display-only
  - User cannot modify duration, understanding score, or any content
  - Only action available: Confirm or Dismiss

**Automatic Detection Flow (Demo Implementation)**:
1. **Mock Data Generation**:
   - System automatically generates learning records from:
     - Pre-defined mock browsing history JSON
     - Simulated time-based session detection
     - Example: User visited "Next.js documentation" for 45 minutes
   
2. **Auto-populated Fields**:
   - URL: From mock browser history
   - Title: Extracted from page title or manually set in mock data
   - Duration: Calculated from session start/end timestamps
   - Understanding: Auto-estimated based on:
     - Session duration (longer = higher score)
     - Revisit count (multiple visits = higher score)
     - Mock algorithm: `min(5, floor(duration/30) + revisits)`
   - Tags: Auto-extracted from URL domain and path
   - Notes: Auto-generated template (e.g., "Automatically recorded learning session")

3. **User Confirmation Flow**:
   ```
   [System detects learning] 
        ↓
   [Display in "Pending" list]
        ↓
   [User clicks record card]
        ↓
   [Show confirmation modal with full details]
        ↓
   [User reviews content (read-only)]
        ↓
   [User clicks "Record to Blockchain"]
        ↓
   [Generate content hash]
        ↓
   [Create Symbol transaction]
        ↓
   [User signs with wallet]
        ↓
   [Confirm on blockchain]
        ↓
   [Move to "Confirmed" list]
        ↓
   [Trigger AI summary generation]
   ```

4. **Mock Detection Logic** (for demo):
```typescript
interface MockBrowsingSession {
  url: string;
  title: string;
  startTime: string;
  endTime: string;
  scrollDepth: number;
  revisits: number;
}

function convertToLearningRecord(session: MockBrowsingSession): LearningRecord {
  const duration = Math.floor(
    (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000
  );
  
  const understanding = Math.min(5, 
    Math.floor(duration / 30) + session.revisits
  ) as 1 | 2 | 3 | 4 | 5;
  
  const tags = extractTags(session.url); // From domain/path
  
  return {
    id: generateUUID(),
    userId: 'demo-user',
    url: session.url,
    title: session.title,
    duration,
    understanding,
    note: `Automatically recorded session (${session.scrollDepth}% scroll depth)`,
    tags,
    createdAt: session.endTime,
    contentHash: '', // Calculated later
    proofStatus: 'pending',
    summaryStatus: 'none'
  };
}
```

**UI States**:
- **Pending Tab**: Records awaiting user confirmation
- **Confirmed Tab**: Records with blockchain proof
- **Dismissed Tab**: Records user chose not to record (optional)

**Error Handling**:
- Auto-detection failure: Show message "新しい学習記録を取得できませんでした"
- Transaction failure: Show retry button on record card
- Network timeout: Keep in "Pending" with "再試行" button

### Mock Data Structure

**`public/mock-browsing-sessions.json`**:
```json
{
  "sessions": [
    {
      "id": "session-001",
      "url": "https://nextjs.org/docs/app/building-your-application/routing",
      "title": "Routing: Defining Routes | Next.js",
      "startTime": "2024-11-01T14:30:00Z",
      "endTime": "2024-11-01T15:15:00Z",
      "scrollDepth": 85,
      "revisits": 2,
      "domain": "nextjs.org",
      "category": "web-development"
    },
    {
      "id": "session-002",
      "url": "https://docs.symbol.dev/concepts/aggregate-transaction.html",
      "title": "Aggregate Transaction - Symbol Documentation",
      "startTime": "2024-11-02T10:00:00Z",
      "endTime": "2024-11-02T12:00:00Z",
      "scrollDepth": 95,
      "revisits": 3,
      "domain": "docs.symbol.dev",
      "category": "blockchain"
    },
    {
      "id": "session-003",
      "url": "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      "title": "Creating Types from Types",
      "startTime": "2024-11-03T16:00:00Z",
      "endTime": "2024-11-03T17:00:00Z",
      "scrollDepth": 70,
      "revisits": 1,
      "domain": "typescriptlang.org",
      "category": "programming-languages"
    }
  ]
}
```

**Conversion to LearningRecord**:
```typescript
// src/lib/detection/auto-tracker.ts
export function convertSessionToRecord(session: BrowsingSession): LearningRecord {
  const duration = calculateDuration(session.startTime, session.endTime);
  const understanding = calculateUnderstanding(duration, session.scrollDepth, session.revisits);
  const tags = extractTags(session.url, session.category);
  const note = generateAutoNote(session);

  return {
    id: generateUUID(),
    userId: 'demo-user',
    url: session.url,
    title: session.title,
    duration,
    understanding,
    note,
    tags,
    createdAt: session.endTime,
    contentHash: '', // Will be calculated before blockchain recording
    proofStatus: 'pending',
    summaryStatus: 'none'
  };
}

function calculateDuration(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.floor(ms / 60000); // Convert to minutes
}

function calculateUnderstanding(
  duration: number, 
  scrollDepth: number, 
  revisits: number
): 1 | 2 | 3 | 4 | 5 {
  // Formula: Base score from duration + bonuses
  let score = Math.floor(duration / 30); // 30 min = 1 point
  score += Math.floor(scrollDepth / 33); // 33% scroll = 1 point
  score += revisits; // Each revisit = 1 point
  
  return Math.min(5, Math.max(1, score)) as 1 | 2 | 3 | 4 | 5;
}

function extractTags(url: string, category: string): string[] {
  const tags: string[] = [category];
  
  // Extract from domain
  const domain = new URL(url).hostname;
  if (domain.includes('nextjs')) tags.push('Next.js');
  if (domain.includes('symbol')) tags.push('Symbol', 'Blockchain');
  if (domain.includes('typescript')) tags.push('TypeScript');
  if (domain.includes('react')) tags.push('React');
  
  // Extract from path
  const path = new URL(url).pathname.toLowerCase();
  if (path.includes('routing')) tags.push('ルーティング');
  if (path.includes('transaction')) tags.push('トランザクション');
  if (path.includes('types')) tags.push('型システム');
  
  return [...new Set(tags)]; // Remove duplicates
}

function generateAutoNote(session: BrowsingSession): string {
  return `自動記録されたセッション (スクロール深度: ${session.scrollDepth}%, 再訪回数: ${session.revisits}回)`;
}
```

**`public/mock-confirmed-records.json`** (for initial tree display):
```json
{
  "records": [
    {
      "id": "record-001",
      "url": "https://react.dev/learn",
      "title": "Learn React",
      "duration": 90,
      "understanding": 4,
      "tags": ["React", "JavaScript"],
      "createdAt": "2024-10-25T10:00:00Z",
      "txHash": "E7A4B9C2D1F3A5B7C9D2E4F6A8B0C2D4E6F8A0B2C4D6E8F0A2B4C6D8E0F2A4B6",
      "blockHeight": 1234567,
      "proofStatus": "confirmed",
      "summaryStatus": "ready",
      "aiSummary": "Reactの基本概念について学習。コンポーネント、Props、Stateの仕組みを理解。"
    },
    {
      "id": "record-002",
      "url": "https://docs.symbol.dev/concepts/account.html",
      "title": "Account - Symbol Docs",
      "duration": 60,
      "understanding": 5,
      "tags": ["Symbol", "Blockchain", "Account"],
      "createdAt": "2024-10-28T14:30:00Z",
      "txHash": "A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2",
      "blockHeight": 1235000,
      "proofStatus": "confirmed",
      "summaryStatus": "ready",
      "aiSummary": "Symbolブロックチェーンのアカウント構造を学習。公開鍵暗号とアドレス生成について理解。"
    }
  ]
}
```

These mock files will be loaded on app initialization to simulate automatic detection and provide initial tree data.

---

### Feature 2: Blockchain Proof Storage ⭐ CRITICAL

**Purpose**: Store tamper-proof learning records on Symbol blockchain.

**Symbol Integration**:

```typescript
// Transaction creation
import { 
  Account, 
  Address, 
  Deadline, 
  PlainMessage, 
  TransferTransaction,
  NetworkType,
  UInt64
} from 'symbol-sdk';

async function createLearningProof(
  record: LearningRecord,
  senderAccount: Account
): Promise<TransferTransaction> {
  const payload: SymbolTransactionPayload = {
    type: 'learning_record',
    version: '1.0',
    id: record.id,
    contentHash: record.contentHash,
    timestamp: record.createdAt,
    metadata: {
      title: record.title,
      duration: record.duration,
      understanding: record.understanding,
      tags: record.tags
    }
  };
  
  const message = PlainMessage.create(JSON.stringify(payload));
  
  return TransferTransaction.create(
    Deadline.create(epochAdjustment),
    Address.createFromRawAddress(senderAccount.address.plain()),
    [],
    message,
    NetworkType.TEST_NET,
    UInt64.fromUint(2000000) // Max fee
  );
}
```

**Transaction Confirmation**:
- Use repositoryFactory.createTransactionStatusRepository()
- Poll every 3 seconds for up to 60 seconds
- Update record status: pending → confirmed/failed

**Data Integrity**:
- Content hash includes: id, url, title, duration, understanding, note, tags, createdAt
- Use SHA-256 (crypto.subtle.digest)
- Store hash in both localStorage and blockchain

**Implementation Priority**: Phase 2 (Days 5-7)

---

### Feature 3: Learning Tree Visualization

**Purpose**: Display learning progression as an interactive node graph.

**Library**: React Flow (https://reactflow.dev/)

**Node Types**:
- **Completed**: Green border, solid fill
- **In Progress**: Yellow border, pattern fill
- **Locked**: Gray border, dim fill

**Node Content**:
- Title (truncated to 30 chars)
- Understanding score (stars or numeric)
- Duration badge
- Blockchain icon (if proof exists)

**Interactions**:
- Click node → Show detail modal
- Hover → Show tooltip with full info
- Drag → Reposition (saved to localStorage)

**Layout Algorithm**:
- Initial: Auto-layout using dagre or elkjs
- Manual override: Allow user to save custom positions

**Mock Prerequisites** (for demo):
```typescript
const mockRelationships = [
  { from: 'react-basics', to: 'react-hooks' },
  { from: 'react-hooks', to: 'next-js' },
  { from: 'javascript', to: 'typescript' },
  { from: 'typescript', to: 'react-basics' }
];
```

**Implementation Priority**: Phase 3 (Days 8-10)

---

### Feature 4: AI-Powered Summarization

**Purpose**: Generate concise summaries of learning records using Gemini API.

**API Integration**:

```typescript
async function generateSummary(record: LearningRecord): Promise<string> {
  const response = await fetch('/api/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record })
  });

  const { summary } = await response.json();
  return summary;
}
```

**API Route** (`src/app/api/summarize/route.ts`):

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const { record } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `以下の学習記録を2-3文で簡潔に要約してください。学習内容と理解の深さを含めてください。

URL: ${record.url}
タイトル: ${record.title}
学習時間: ${record.duration}分
理解度: ${record.understanding}/5
メモ: ${record.note}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const summary = response.text();

  return Response.json({ summary });
}
```

**Execution Timing**:
- Trigger: After blockchain transaction confirmed
- Background: Use async/await, non-blocking
- Retry: Up to 3 attempts with exponential backoff
- Fallback: Display "要約生成失敗" with manual retry button

**Implementation Priority**: Phase 3 (Days 10-11)

---

### Feature 5: Proof Verification UI ⭐ CRITICAL

**Purpose**: Allow third parties to verify learning records' authenticity.

**Input**:
- Transaction hash (text input)
- OR record ID (lookup from blockchain)

**Verification Steps**:

```typescript
async function verifyProof(txHash: string): Promise<VerificationResult> {
  // 1. Fetch transaction from Symbol
  const tx = await repositoryFactory
    .createTransactionRepository()
    .getTransaction(txHash, TransactionGroup.Confirmed);
  
  // 2. Parse message payload
  const payload = JSON.parse(tx.message.payload);
  
  // 3. Fetch local record by ID
  const localRecord = getLocalRecord(payload.id);
  
  // 4. Recalculate content hash
  const calculatedHash = await calculateHash(localRecord);
  
  // 5. Compare hashes
  const hashMatch = calculatedHash === payload.contentHash;
  
  // 6. Check timestamp consistency
  const timestampMatch = localRecord.createdAt === payload.timestamp;
  
  return {
    valid: hashMatch && timestampMatch,
    txHash,
    blockHeight: tx.transactionInfo.height,
    timestamp: payload.timestamp,
    details: {
      hashMatch,
      timestampMatch,
      title: payload.metadata.title
    }
  };
}
```

**UI Display**:
- ✅ Green checkmark: All verifications passed
- ❌ Red X: Hash mismatch (potential tampering)
- ℹ️ Info: Transaction details (block, timestamp)
- 🔗 Link: Symbol Explorer URL

**Symbol Explorer Link**:
```
https://testnet.symbol.fyi/transactions/${txHash}
```

**Implementation Priority**: Phase 4 (Days 12-13)

---

### Feature 6: Portfolio Sharing Page

**Purpose**: Generate public URLs to share learning achievements.

**URL Structure**:
```
/portfolio/[symbolAddress]
```

**Page Content**:
1. **Header**:
   - User identifier (Symbol address, shortened)
   - Total stats (records, hours, avg understanding)

2. **AI Summary**:
   - Overall learning narrative (Gemini-generated)
   - Key topics covered

3. **Interactive Tree**:
   - Embedded learning tree visualization
   - Read-only mode

4. **Record List**:
   - Cards showing each learning record
   - Blockchain proof badge (with verification link)
   - AI summary excerpt

5. **Verification CTA**:
   - "Verify All Records" button
   - Links to individual transaction hashes

**Data Loading**:
- If userId in localStorage: Load from local
- Else: Display message "Portfolio not found"
- Future: Could use Symbol metadata to store portfolio index

**Implementation Priority**: Phase 3 (Days 11-12)

---

## Implementation Phases

### Phase 1: Project Setup (Days 1-2)

**Tasks**:
- [x] Initialize Next.js project with TypeScript
- [x] Install dependencies:
  ```bash
  npm install symbol-sdk @google/generative-ai
  npm install reactflow
  npm install -D tailwindcss postcss autoprefixer
  npm install uuid
  npm install @types/uuid
  ```
- [x] Create directory structure (including `src/lib/detection/`)
- [x] Set up Tailwind CSS configuration
- [x] Create type definitions in `src/types/index.ts`
  - Include `BrowsingSession` interface
  - Include `LearningRecord` with `proofStatus` field
- [x] Create constants in `src/constants/index.ts`
- [x] Set up `.env.local` and `.env.example`
- [x] Initialize Symbol SDK connection test
- [x] Create mock data files:
  - `public/mock-browsing-sessions.json` (10-15 realistic sessions)
  - `public/mock-confirmed-records.json` (2-3 pre-confirmed records)

**Deliverable**: Project skeleton with successful Symbol testnet connection and realistic mock data ready for auto-detection simulation.

---

### Phase 2: Core Features (Days 3-7)

**Tasks**:
- [x] Create mock browsing session data (`public/mock-browsing-sessions.json`)
  - 10-15 realistic learning sessions
  - Include: URLs, timestamps, scroll depth, revisit counts
- [x] Build automatic record detection logic (`src/lib/detection/auto-tracker.ts`)
  - Convert browsing sessions to LearningRecord format
  - Calculate understanding scores from duration/revisits
  - Extract tags from URLs
- [x] Build PendingRecords component
  - Display auto-detected records in card layout
  - Show all details (read-only, no edit controls)
  - Confirmation button on each card
- [x] Build ConfirmationModal component
  - Expanded view of selected record
  - Display calculated content hash
  - "Record to Blockchain" action button
  - Warning message about immutability
- [x] Implement localStorage operations (`src/lib/storage/local.ts`)
  - savePendingRecords()
  - confirmRecord()
  - getConfirmedRecords()
  - dismissRecord() (optional)
- [x] Create Symbol transaction functions (`src/lib/symbol/transaction.ts`)
  - createLearningProof()
  - signAndAnnounce()
  - confirmTransaction()
- [x] Build confirmed records view
  - Display cards with blockchain proof badges
  - Show transaction hash and block height
- [x] Add loading states during blockchain confirmation
- [x] Implement error handling and retry logic

**Deliverable**: Auto-detected records → user confirmation → blockchain proof creation flow.

**Key Difference from Manual Input**: 
- No form validation (data is pre-validated)
- No user editing (all fields are system-generated)
- User interaction limited to "confirm" or "dismiss"

---

### Phase 3: Visualization & AI (Days 8-12)

**Tasks**:
- [x] Integrate React Flow
  - Create custom node components
  - Implement auto-layout with dagre
  - Add zoom/pan controls
- [x] Build learning tree page (`/tree`)
  - Load records from localStorage
  - Convert to React Flow format
  - Mock prerequisite relationships
- [x] Implement Gemini API integration
  - Create `/api/summarize` route
  - Add retry logic
  - Update record with AI summary
- [x] Build portfolio page (`/portfolio/[id]`)
  - Dynamic route with user ID
  - Display stats dashboard
  - Embed learning tree
  - Show AI summaries

**Deliverable**: Interactive learning tree + AI-powered portfolio.

---

### Phase 4: Verification & Polish (Days 13-15)

**Tasks**:
- [x] Build verification page (`/verify`)
  - Transaction hash input
  - Fetch from Symbol network
  - Calculate and compare hashes
  - Display verification result
- [x] Add navigation header
  - Links to all pages
  - Symbol network indicator
- [x] Styling and responsive design
  - Mobile-friendly layouts
  - Loading skeletons
  - Animations for transitions
- [x] Create demo data (`public/mock-data.json`)
  - 5-10 sample records
  - Realistic URLs and content
  - Pre-defined tree structure
- [x] Write README with demo instructions
- [x] Test all flows end-to-end

**Deliverable**: Polished demo-ready application.

---

## Environment Variables

Create `.env.local`:

```bash
# Symbol Blockchain
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=testnet
NEXT_PUBLIC_SYMBOL_NODE_URL=https://sym-test-03.opening-line.jp:3001
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4

# Google AI API (server-side only)
GOOGLE_AI_API_KEY=your-google-ai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=symproof-tree
```

Create `.env.example`:

```bash
NEXT_PUBLIC_SYMBOL_NETWORK_TYPE=testnet
NEXT_PUBLIC_SYMBOL_NODE_URL=
NEXT_PUBLIC_SYMBOL_GENERATION_HASH=
GOOGLE_AI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=symproof-tree
```

---

## Constraints & Simplifications

### For Demo Scope

**✅ Included**:
- Automatic learning detection (via mock browsing data)
- User confirmation workflow (read-only review + approve)
- Symbol testnet transactions
- Basic localStorage persistence
- AI summarization via Gemini API
- Simple tree visualization with mock prerequisites
- Verification UI for blockchain proofs

**❌ Excluded**:
- Real browser extension (use mock JSON data instead)
- Live browser activity tracking
- User editing of auto-generated records (intentionally blocked)
- User authentication (use Symbol address as identifier)
- Multi-user database (single-user localStorage)
- Complex session detection algorithms (use simple time-based logic)
- Real-time collaboration features
- Advanced analytics dashboard
- Privacy controls beyond dismiss functionality

### Demo Implementation Strategy

**Simulating Automatic Detection**:
- Create `public/mock-browsing-sessions.json` with realistic data
- Implement simple algorithm to convert sessions to learning records:
  ```typescript
  Duration = endTime - startTime
  Understanding = min(5, floor(duration/30) + revisitCount)
  Tags = extract from URL domain/path
  ```
- On app load, show these records in "Pending" state
- User cannot edit fields, only confirm or dismiss

**Why No Editing Allowed**:
- Maintains objectivity of automatic detection
- Prevents user manipulation of learning metrics
- Demonstrates blockchain value proposition (tamper-proof)
- Aligns with real-world implementation (browser extension would not allow editing)

### Technical Notes

1. **Wallet Integration**:
   - User must have Symbol Desktop Wallet or browser extension
   - Transactions require manual signing (cannot be automated)
   - Provide clear instructions for testnet XYM acquisition

2. **Transaction Timing**:
   - Symbol block time: ~30 seconds
   - Show loading indicator during confirmation
   - Implement timeout handling (60s max)

3. **LocalStorage Limits**:
   - Max ~5-10MB per domain
   - For demo, limit to 100 records total (pending + confirmed)
   - Consider indexedDB if needed (future)

4. **AI API Costs**:
   - Gemini API: Free tier available (15 requests/minute)
   - Rate limiting: Handle 429 errors gracefully
   - Cache summaries to avoid regeneration

5. **Mock Data Realism**:
   - Use actual learning resource URLs (Next.js docs, Symbol docs, etc.)
   - Realistic durations (15-120 minutes per session)
   - Believable revisit patterns (0-3 revisits)
   - Varied understanding scores (not all 5/5)

---

## Demo Scenario Script

**For Internship Presentation**:

1. **Introduction** (30 seconds):
   - "今回のデモでは、Symbolブロックチェーンを活用した学習証跡管理システムを紹介します"
   - "このシステムは、Web上での学習活動を自動的に検出し、改ざん不可能な証跡として記録します"

2. **Automatic Detection** (2 minutes):
   - Open home page showing "Pending Records" tab
   - Explain: "システムが自動的にブラウザでの学習活動を検出しました"
   - Show list of 3-5 auto-detected records:
     - "Next.js App Routerの公式ドキュメント - 45分"
     - "Symbol Blockchain入門 - 120分"
     - "TypeScript型システムの学習 - 60分"
   - Point out auto-generated fields:
     - Duration: "滞在時間から自動計算"
     - Understanding: "再訪回数とスクロール深度から推定"
     - Tags: "URLから自動抽出"
   - **Key point**: "ユーザーはこれらの値を編集できません。システムが客観的に記録します"

3. **Record Confirmation** (2 minutes):
   - Click on first record card
   - Show confirmation modal with full details (read-only)
   - Point out content hash: "この内容のハッシュ値がブロックチェーンに記録されます"
   - Show warning: "記録後は変更できません"
   - Click "ブロックチェーンに記録する" button
   - Show Symbol wallet signature popup
   - Explain: "ユーザーは記録の実行を承認するだけです"
   - Wait for transaction confirmation (~30 seconds)
   - Record moves from "Pending" to "Confirmed" tab
   - Point out txHash and block height displayed on card

4. **Tree Visualization** (1 minute):
   - Navigate to `/tree` page
   - Show newly confirmed node in green (with other mock completed nodes)
   - Explain prerequisite relationships
   - Demonstrate zoom and pan
   - "学習の進捗が視覚的に把握できます"

5. **AI Summary** (30 seconds):
   - Return to "Confirmed" tab on home page
   - Show AI-generated summary on confirmed record card
   - Explain: "記録確定後、AIが自動的に学習内容を要約します"
   - Read summary aloud: "Next.jsのApp Routerについて45分間学習。サーバーコンポーネントとクライアントコンポーネントの使い分けを理解。"

6. **Verification** (2 minutes):
   - Navigate to `/verify` page
   - Copy txHash from confirmed record
   - Paste and click "Verify"
   - Show verification results:
     - ✅ Transaction exists on Symbol blockchain
     - ✅ Content hash matches (no tampering)
     - ✅ Timestamp verified
   - Open Symbol Explorer link in new tab
   - Explain: "第三者が記録の真正性を検証できます"
   - **Key point**: "自動記録なので、主観的な改ざんの余地がありません"

7. **Portfolio Sharing** (1 minute):
   - Navigate to `/portfolio/[address]`
   - Show stats dashboard: "総学習時間: 225分, 記録数: 5, 平均理解度: 4.2"
   - Scroll through confirmed record list with AI summaries
   - Show learning tree embedded in portfolio
   - Explain: "このURLを企業に共有することで、客観的な学習履歴を証明できます"

8. **Closing** (30 seconds):
   - Recap: "自動検出により、恣意的な改ざんを防止"
   - "Symbolブロックチェーンで改ざん耐性を保証"
   - "就職活動での信頼性の高いポートフォリオとして活用可能"
   - Future vision: "ブラウザ拡張での実装により、リアルタイム記録も可能"

**Total Duration**: ~8-9 minutes

**Key Messages for Demo**:
1. ✅ **自動性**: ユーザーが入力する必要がない
2. ✅ **客観性**: システムが記録するので改ざん不可
3. ✅ **透明性**: すべての記録がブロックチェーンで検証可能
4. ✅ **実用性**: 就職活動で使える信頼性の高いポートフォリオ

---

## Success Criteria

### Minimum Viable Demo (Must Have)
- ✅ Load and display auto-detected learning records (from mock JSON)
- ✅ Show pending records with all auto-generated fields (read-only)
- ✅ User can confirm pending records (no editing allowed)
- ✅ Generate Symbol blockchain transaction upon confirmation
- ✅ Display transaction hash and block height on confirmed records
- ✅ Show learning tree with at least 5-7 nodes (mix of pending and confirmed)
- ✅ Verify transaction authenticity on separate page
- ✅ Generate AI summary for confirmed records
- ✅ Demonstrate that user cannot edit auto-generated data

### Demo Quality Requirements
- 📊 Realistic mock browsing data (10-15 sessions)
- 📊 Varied durations (15-120 minutes)
- 📊 Believable understanding scores (1-5 based on metrics)
- 📊 Proper categorization and tagging
- 📊 Working testnet XYM in wallet
- 📊 Clear visual distinction between pending and confirmed records
- 📊 Smooth confirmation flow (< 5 seconds to transaction submission)

### Nice to Have (If Time Permits)
- 🎯 Animated transitions between pending and confirmed states
- 🎯 Responsive mobile layout
- 🎯 Dark mode toggle
- 🎯 Export portfolio as PDF
- 🎯 Batch confirmation (select multiple records)
- 🎯 Dismiss functionality for unwanted auto-detected records
- 🎯 Real-time transaction status updates (polling)

### Presentation Requirements
- 📊 At least 3-5 pending records ready to demonstrate
- 📊 At least 2-3 pre-confirmed records for tree visualization
- 📊 Screenshots/video backup (in case of live demo issues)
- 📊 Symbol Explorer link ready to share
- 📊 Prepared explanation of auto-detection algorithm

### Key Demonstration Points
1. **Automatic Detection**: "システムが学習を自動記録"
2. **No User Editing**: "客観性を保つため編集不可"
3. **Blockchain Proof**: "改ざん不可能な証跡"
4. **Easy Verification**: "第三者が即座に検証可能"

---

## Next Steps for Claude Code

**To start implementation, execute in order**:

1. **Phase 1 - Setup**:
   ```
   Create Next.js project with TypeScript and Tailwind CSS.
   Install all dependencies listed in Phase 1.
   Set up directory structure as specified (including src/lib/detection/).
   Create type definitions including BrowsingSession and LearningRecord.
   Create constants files.
   Initialize Symbol SDK and test connection to testnet.
   Create mock-browsing-sessions.json with 10-15 realistic learning sessions.
   Create mock-confirmed-records.json with 2-3 pre-confirmed records.
   ```

2. **Phase 2 - Auto Detection & Confirmation**:
   ```
   Implement auto-tracker.ts to convert BrowsingSession to LearningRecord.
   Implement score-calculator.ts with understanding score algorithm.
   Implement tag-extractor.ts to extract tags from URLs.
   Build PendingRecords component showing auto-detected records (read-only).
   Build ConfirmationModal component for user review and approval.
   Create localStorage wrapper functions for pending/confirmed records.
   Build Symbol transaction creation and confirmation logic.
   Add confirmed records view with blockchain proof indicators.
   Ensure NO editing capability for auto-generated fields.
   ```

3. **Phase 3 - Visualization & AI**:
   ```
   Integrate React Flow for tree visualization.
   Load both pending and confirmed records into tree.
   Implement Gemini API route for summarization.
   Build portfolio page with dynamic routing.
   Display auto-detection metadata (scroll depth, revisits, etc.).
   ```

4. **Phase 4 - Verification & Polish**:
   ```
   Create verification page with hash comparison.
   Add navigation and styling.
   Test complete flow: auto-detect → confirm → blockchain → verify.
   Prepare demo scenario with pending records ready.
   ```

**Critical Implementation Note**: 
The user CANNOT edit any auto-generated fields. All fields in pending records must be displayed as read-only. The only user actions are:
- Click to view full details
- Click "Record to Blockchain" to confirm
- (Optional) Click "Dismiss" to ignore

**Start with Phase 1 now. Create the project structure and mock data files first.**

---

## References

- Symbol Documentation: https://docs.symbol.dev/
- Symbol SDK (TypeScript): https://www.npmjs.com/package/symbol-sdk
- Symbol Testnet Explorer: https://testnet.symbol.fyi/
- React Flow: https://reactflow.dev/
- Google Gemini API: https://ai.google.dev/
- Next.js App Router: https://nextjs.org/docs/app

---

**End of Specification**
