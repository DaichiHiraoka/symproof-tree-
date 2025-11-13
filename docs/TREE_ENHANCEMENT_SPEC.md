# Learning Tree Accuracy Enhancement Specification

## 📋 Document Purpose

This document specifies enhancements to improve the **learning tree construction accuracy** in the symproof-tree system. All baseline features from the original SPEC.md are assumed to be implemented.

**Target Audience**: Claude Code agent for implementation  
**Focus**: Abstract specifications of WHAT to implement, not HOW  
**Core Objective**: Enhance tree layout precision through multi-layered analysis

---

## 🎯 Enhancement Goals

### Primary Objective
Improve the accuracy and reliability of learning tree visualization by:
1. **Normalizing terminology** across learning records
2. **Calculating abstraction levels** more precisely
3. **Measuring relationships** between learning nodes more reliably
4. **Ensuring verifiability** of analysis results

### Success Metrics
- Reduced terminology inconsistencies (target: 80% reduction)
- More stable abstraction level judgments (target: 30% accuracy improvement)
- Clearer prerequisite relationships in tree visualization
- Enhanced blockchain proof coverage (analysis results included)

---

## 🏗️ Architecture Overview

```
Current System:
  Learning Record → LLM Analysis → Tree Placement

Enhanced System:
  Learning Record 
    → [Layer 1] Rule-based Normalization
    → [Layer 2] Statistical Feature Extraction  
    → [Layer 3] LLM Structured Analysis
    → [Synthesis] Multi-signal Scoring
    → Tree Placement
    → [Blockchain] Extended Proof Recording
```

### Enhancement Layers

1. **Preprocessing Layer**: Clean and normalize input data
2. **Terminology Layer**: Standardize technical vocabulary
3. **Analysis Layer**: Multi-method feature extraction
4. **Synthesis Layer**: Combine signals for robust scoring
5. **Proof Layer**: Record analysis artifacts on blockchain

---

## 📦 Enhancement Components

### Component 1: Domain Vocabulary Ontology ⭐ CRITICAL

**Purpose**: Normalize terminology variations to ensure consistent categorization

**What It Does**:
- Maps synonyms to canonical terms (e.g., "React" ← ["react", "リアクト", "React.js"])
- Defines prerequisite relationships between concepts
- Maintains category hierarchies

**Expected Behavior**:
- When analyzing a record mentioning "React.js", system should recognize it as "React"
- When detecting "JavaScript ES6" and "React", system should infer prerequisite relationship
- Category assignments should be consistent across similar content

**Data Structure Requirements**:
- Vocabulary mappings (canonical ↔ aliases)
- Concept hierarchy (DAG structure)
- Category definitions

**Integration Points**:
- Apply during automatic detection (tag extraction)
- Use in LLM prompt construction
- Reference in tree edge generation

---

### Component 2: Enhanced Data Preprocessing ⭐ CRITICAL

**Purpose**: Improve input quality by filtering noise and normalizing content

**What It Does**:
- Remove duplicate URLs and mirror sites
- Identify and merge split sessions (same learning activity interrupted)
- Filter out template/navigation content
- Normalize text representations

**Expected Behavior**:
- If user visits "example.com/docs" and "example.com/docs?lang=en", treat as single record
- If two sessions on same URL are 10 minutes apart, consider merging
- Extract only meaningful content, not boilerplate text
- Standardize date/time formats and text encoding

**Quality Improvements**:
- Cleaner tree visualization (fewer redundant nodes)
- More accurate duration calculations
- Better embedding/similarity results downstream

---

### Component 3: Blockchain-Recorded Feature Hashes ⭐ CRITICAL

**Purpose**: Extend blockchain proof to include analysis artifacts for third-party verification

**What It Does**:
- Generate hash of embedding vector (with model version)
- Hash statistical features used in analysis
- Record all hashes in Symbol transaction alongside content hash

**Expected Behavior**:
- When record is confirmed, transaction should include:
  - Original contentHash (existing)
  - embeddingHash + model identifier
  - featureHash (TF-IDF top terms, etc.)
- Third party can recalculate these hashes to verify analysis integrity

**Blockchain Integration**:
- Extend transaction message structure
- Minimal additional data (~100-200 bytes per transaction)
- No impact on confirmation time

---

### Component 4: Two-Stage Abstraction Level Estimation ⭐ CRITICAL

**Purpose**: Determine learning content abstraction level (1=foundational to 5=specialized) more reliably

**What It Does**:
- **Stage 1 (Rule-based)**: Fast initial estimation using URL patterns, keywords, metadata
- **Stage 2 (LLM-based)**: Refined judgment using contextual understanding
- Compare stages and flag large discrepancies for review

**Expected Behavior**:
- Record with "/tutorial/" or "getting-started" in URL → Stage 1 estimates level 1-2
- Record with "/advanced/" or "optimization" → Stage 1 estimates level 4-5
- LLM validates/adjusts this estimate with reasoning
- If stages differ by >2 levels, request explicit justification from LLM

**Tree Impact**:
- Abstraction level determines radius from center in polar layout
- More accurate levels → clearer visual hierarchy
- Reduces misplaced nodes (beginners' content appearing as advanced)

**Output Requirements**:
- Numerical level (1-5)
- Reasoning text
- Confidence score
- Stage 1 vs Stage 2 comparison

---

### Component 5: Multi-Signal Similarity Scoring 🎯 HIGH PRIORITY

**Purpose**: Calculate relationship strength between learning records using multiple complementary methods

**What It Does**:
- **Signal 1 (Rule-based)**: URL pattern matching, title keywords
- **Signal 2 (Statistical)**: TF-IDF or BM25 text similarity
- **Signal 3 (Semantic)**: Embedding vector cosine similarity (if available)
- Combine signals with weighted average

**Expected Behavior**:
- Two records about "React Hooks" should score high similarity even if wording differs
- Records from same domain (e.g., docs.react.dev) get rule-based boost
- Statistical method catches keyword overlap
- Semantic method catches conceptual similarity
- Final score = weighted combination (e.g., 0.2×rule + 0.3×statistical + 0.5×semantic)

**Weight Tuning**:
- Provide configurable weights
- If embedding not available, redistribute weight to other signals
- Example: no embedding → 0.4×rule + 0.6×statistical

**Tree Impact**:
- Determines which nodes are clustered together
- Influences edge drawing between related concepts
- Enables category-based tree filtering

**Output**:
- Similarity scores for all record pairs (sparse matrix)
- Top-k most similar records per node
- Threshold-based edge candidates

---

### Component 6: Prerequisite Edge Inference ⚙️ OPTIONAL (Time Permitting)

**Purpose**: Automatically detect prerequisite relationships between learning records

**What It Does**:
- **Temporal Analysis**: Earlier records in same category may be prerequisites
- **Coverage Analysis**: If node B's vocabulary is subset of node A, A→B candidate
- **Causal Cues**: Extract "prerequisite", "requires", "before" mentions from content
- **DAG Constraint**: Validate that inferred edges don't create cycles

**Expected Behavior**:
- "JavaScript Basics" (learned in Week 1) → "React Hooks" (learned in Week 3)
- Record mentioning "Requires: Understanding of JavaScript closures" → find closure-related record as prerequisite
- System automatically proposes edges, potentially with confidence scores
- User can accept/reject suggestions (within "edit-prohibited" principle)

**Tree Impact**:
- Automatic arrow drawing between prerequisite relationships
- Clearer learning progression paths
- Visual hierarchy reinforcement

**Edge Cases**:
- Multiple possible prerequisites → rank by confidence
- Circular dependency detection → reject and flag
- Weak signals → mark as "suggested" rather than confirmed

---

## 🔄 Integration Flow

### When a New Learning Record is Confirmed:

```
1. Preprocessing
   ├─ Remove duplicates
   ├─ Normalize text
   └─ Extract clean content

2. Terminology Normalization
   ├─ Map aliases to canonical terms
   ├─ Identify category
   └─ Extract standardized tags

3. Feature Extraction
   ├─ Stage 1: Rule-based abstraction estimate
   ├─ Calculate TF-IDF features
   └─ (Optional) Generate embedding vector

4. LLM Analysis
   ├─ Request structured JSON output
   ├─ Include Stage 1 estimate in prompt
   ├─ Validate Stage 2 against Stage 1
   └─ Extract prerequisites list

5. Similarity Scoring
   ├─ Compare with existing records
   ├─ Multi-signal calculation
   └─ Generate relationship matrix

6. (Optional) Edge Inference
   ├─ Apply temporal/coverage/causal rules
   ├─ Validate DAG constraint
   └─ Propose prerequisite edges

7. Hash Generation
   ├─ Hash embedding vector
   ├─ Hash TF-IDF features
   └─ Hash analysis results

8. Blockchain Recording
   ├─ Include all hashes in transaction
   ├─ Sign and announce
   └─ Confirm on Symbol network

9. Tree Update
   ├─ Place node based on abstraction level
   ├─ Draw edges based on similarity/prerequisites
   └─ Apply category filter if active
```

---

## 📊 Data Structures

### Enhanced Learning Record

```typescript
interface EnhancedLearningRecord extends LearningRecord {
  // Existing fields remain...
  
  // New fields for enhancement:
  normalizedTerms?: {
    canonical: string[];
    categories: string[];
  };
  
  abstractionAnalysis?: {
    stage1Estimate: number;      // Rule-based
    stage2Estimate: number;       // LLM-based
    finalLevel: number;           // Reconciled
    reasoning: string;
    confidence: number;
  };
  
  features?: {
    tfidfTopTerms?: string[];
    tfidfVector?: number[];
    embeddingVector?: number[];
    embeddingModel?: string;
  };
  
  relationships?: {
    similarRecords: Array<{
      recordId: string;
      score: number;
      signals: {
        rule: number;
        statistical: number;
        semantic: number;
      };
    }>;
    prerequisites?: string[];     // Inferred prerequisite record IDs
  };
}
```

### Ontology Schema

```typescript
interface VocabularyOntology {
  terms: {
    [canonical: string]: {
      aliases: string[];
      category: string;
      prerequisites?: string[];
      abstractionLevel?: number;
    };
  };
  
  categories: {
    [name: string]: {
      parent?: string;
      description: string;
    };
  };
}
```

### Blockchain Proof Extension

```typescript
interface ExtendedBlockchainProof {
  // Existing fields...
  contentHash: string;
  
  // New fields:
  analysisArtifacts?: {
    embeddingHash?: string;
    embeddingModel?: string;
    featureHash?: string;
    abstractionLevel: number;
    analysisTimestamp: string;
  };
}
```

---

## 🎯 Implementation Priorities

### Phase A: Foundation (Required) ⭐

**Tasks**:
1. Create vocabulary ontology data structure
2. Implement terminology normalization function
3. Add preprocessing pipeline (deduplication, normalization)
4. Extend blockchain proof structure
5. Implement hash generation for new features

**Estimated Time**: 2-3 days

**Deliverables**:
- Ontology JSON file with initial terms
- Normalization utility functions
- Updated transaction creation with extended proof
- Preprocessing applied to all incoming records

---

### Phase B: Analysis Enhancement (Required) ⭐

**Tasks**:
1. Implement Stage 1 abstraction estimation (rule-based)
2. Extend LLM prompt to include Stage 1 estimate
3. Add Stage 2 validation logic
4. Store abstraction analysis results
5. Update tree layout to use enhanced abstraction levels

**Estimated Time**: 2 days

**Deliverables**:
- Two-stage estimation pipeline
- Updated tree radius calculation
- Discrepancy detection and logging

---

### Phase C: Similarity & Relationships (High Priority) 🎯

**Tasks**:
1. Implement TF-IDF calculation (server-side recommended)
2. Create multi-signal scoring function
3. Calculate similarity matrix for existing records
4. Update tree clustering logic
5. Add category filter UI (if not present)

**Estimated Time**: 2-3 days

**Deliverables**:
- Similarity scoring API endpoint
- Updated tree with similarity-based clustering
- Configurable signal weights

---

### Phase D: Edge Inference (Optional) ⚙️

**Tasks**:
1. Implement temporal analysis
2. Add vocabulary coverage checker
3. Extract causal cues from text
4. Implement DAG validation
5. Create edge suggestion UI

**Estimated Time**: 2-3 days

**Deliverables**:
- Automatic prerequisite edge generation
- DAG constraint validator
- Edge confidence scores

---

## 🧪 Testing & Validation

### For Each Component:

**Terminology Normalization**:
- Input: "React.js", "react", "リアクト" → Output: "React" (consistent)
- Input: Unknown term → Output: Term as-is (graceful degradation)

**Abstraction Estimation**:
- Input: URL with "/tutorial/" → Stage 1: 1-2
- Input: Conflicting signals → Flag for review
- Output: Always 1-5, never null

**Similarity Scoring**:
- Input: Two identical records → Score: ~0.95-1.0
- Input: Completely unrelated records → Score: <0.3
- Edge case: Empty content → Score: 0.0

**Blockchain Proof**:
- All transactions include new hash fields
- Hashes are deterministic (same input → same hash)
- Verification endpoint can recalculate and confirm

---

## 🚫 Non-Goals (Out of Scope)

The following are explicitly NOT part of this enhancement:

❌ **Automated quiz generation** (future feature)  
❌ **Active learning / user feedback loop** (complex ML pipeline)  
❌ **Real-time embedding generation** (use pre-computed or mock)  
❌ **Multi-user collaboration features**  
❌ **Advanced graph layout algorithms** (use existing React Flow auto-layout)  
❌ **Natural language inference models** (rely on LLM)

---

## 📐 Design Constraints

### Performance Requirements:
- Preprocessing: <1 second per record
- Similarity calculation: <5 seconds for 30 records
- Tree re-rendering: <2 seconds
- No blocking operations on main thread

### Compatibility:
- Must work with existing localStorage structure
- Backward compatible with records created before enhancement
- Graceful degradation if optional features unavailable

### Scalability:
- Support up to 100 records efficiently
- Sparse matrix for similarity (store only top-k)
- Lazy loading for large trees

---

## 🎤 Demo Enhancement Points

When presenting the enhanced system, emphasize:

1. **Robustness**: "Terminology normalization ensures consistent categorization despite user input variations"

2. **Precision**: "Two-stage estimation combines fast rules with deep LLM analysis for accurate abstraction levels"

3. **Verifiability**: "Analysis features are hashed and recorded on blockchain, allowing third-party recalculation"

4. **Intelligence**: "Multi-signal scoring captures relationships that single methods miss"

5. **Automation**: "Prerequisite edges are inferred automatically, reducing manual tree construction"

---

## 📝 Configuration Example

Provide a configuration file for tuning:

```json
{
  "preprocessing": {
    "enableDeduplication": true,
    "sessionMergeThreshold": 1800,
    "minSessionDuration": 60
  },
  
  "abstraction": {
    "stage1Rules": {
      "tutorialKeywords": ["tutorial", "getting-started", "intro"],
      "advancedKeywords": ["advanced", "optimization", "internals"]
    },
    "discrepancyThreshold": 2
  },
  
  "similarity": {
    "weights": {
      "rule": 0.2,
      "statistical": 0.3,
      "semantic": 0.5
    },
    "topK": 5,
    "edgeThreshold": 0.6
  },
  
  "edgeInference": {
    "enabled": false,
    "minConfidence": 0.7,
    "maxPrerequisites": 3
  }
}
```

---

## 🔍 Validation Checklist

Before considering enhancements complete:

### Terminology Normalization
- [ ] Ontology file exists with at least 20 canonical terms
- [ ] Normalization applied during auto-detection
- [ ] Tags in database show canonical forms

### Abstraction Estimation
- [ ] Stage 1 rules implemented and tested
- [ ] LLM receives Stage 1 estimate in prompt
- [ ] Discrepancies logged or flagged
- [ ] Tree nodes positioned by abstraction level

### Blockchain Proof
- [ ] Transaction messages include extended fields
- [ ] Hashes are non-empty for confirmed records
- [ ] Verification endpoint can validate hashes

### Similarity Scoring
- [ ] Multi-signal function implemented
- [ ] Weights configurable
- [ ] Similar records identified correctly in tests

### Optional: Edge Inference
- [ ] Prerequisite edges generated for test data
- [ ] No cycles in resulting graph
- [ ] Edges visible in tree visualization

---

## 🤝 Integration with Existing System

### Expected Touchpoints:

**Auto-detection Logic** (`src/lib/detection/auto-tracker.ts`):
- Add normalization step after tag extraction
- Apply preprocessing before record creation

**LLM Analysis** (`src/app/api/analyze-abstraction/route.ts`):
- Include Stage 1 estimate in prompt
- Parse Stage 2 from response
- Validate and reconcile

**Tree Visualization** (`src/components/LearningTree.tsx`):
- Use abstraction level for radius calculation
- Use similarity scores for clustering
- Render prerequisite edges

**Blockchain Recording** (`src/lib/symbol/transaction.ts`):
- Extend payload with new hashes
- Ensure backward compatibility

---

## 📚 Reference Materials

### For Terminology Normalization:
- Research common aliases in target domains (React, Symbol, TypeScript, etc.)
- Consider internationalization (English/Japanese variations)

### For TF-IDF Implementation:
- Use existing libraries where possible (natural, tf-idf npm packages)
- Or implement simple version for demo purposes

### For DAG Validation:
- Standard topological sort algorithm
- Detect cycles with DFS

---

## 🎓 Learning Outcomes

After implementing these enhancements, the system will:

1. **Handle ambiguity** better through normalization
2. **Judge abstraction** more accurately through two-stage analysis
3. **Prove integrity** more comprehensively through extended blockchain records
4. **Discover relationships** more reliably through multi-signal scoring
5. **Automate structure** more effectively through edge inference

These improvements directly address the core challenge: **building an accurate, verifiable learning tree from noisy real-world data**.

---

**End of Specification**

**Version**: 1.0 - Tree Accuracy Enhancement  
**Date**: 2024-11-12  
**Target**: Claude Code implementation agent  
**Status**: Ready for implementation
