import { BusinessProfileData, CalculatedRequirement } from './types';
import { GOVERNMENT_RULES } from './rules';

export function evaluateBusinessCompliance(profile: BusinessProfileData): {
  requirements: CalculatedRequirement[];
  totalSetupCost: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  needsVerificationCount: number;
} {
  let totalSetupCost = 0;
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;
  let needsVerificationCount = 0;

  const requirements: CalculatedRequirement[] = GOVERNMENT_RULES.map((rule) => {
    const evalResult = rule.evaluate(profile);
    const estimatedFee = typeof rule.estimatedFee === 'function' 
      ? rule.estimatedFee(profile) 
      : rule.estimatedFee;

    // Count statistics
    if (evalResult.status === 'NEEDS_VERIFICATION' || evalResult.status === 'CONDITIONAL') {
      needsVerificationCount++;
    }

    if (evalResult.status !== 'NOT_APPLICABLE') {
      totalSetupCost += estimatedFee;
      if (rule.priority === 'CRITICAL') criticalCount++;
      else if (rule.priority === 'HIGH') highCount++;
      else if (rule.priority === 'MEDIUM') mediumCount++;
      else if (rule.priority === 'LOW') lowCount++;
    }

    return {
      code: rule.code,
      agency: rule.agency,
      title: rule.title,
      description: rule.description,
      whyItApplies: rule.whyItApplies,
      whyItMightNotApply: rule.whyItMightNotApply,
      consequencesAndPenalties: rule.consequencesAndPenalties,
      priority: rule.priority,
      applicabilityStatus: evalResult.status,
      completionState: evalResult.status === 'NOT_APPLICABLE' ? 'COMPLETED' : 'NOT_STARTED',
      estimatedFee,
      legalBasis: rule.legalBasis,
      officialSource: rule.officialSource,
      officialSourceUrl: rule.officialSourceUrl,
      dateVerified: rule.dateVerified,
      frequency: rule.frequency,
      reasoning: evalResult.reasoning,
      actionItem: evalResult.actionItem
    };
  });

  return {
    requirements,
    totalSetupCost,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    needsVerificationCount
  };
}
