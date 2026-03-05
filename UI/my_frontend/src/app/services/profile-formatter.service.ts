import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileFormatterService {
  
  formatProfileData(client: any) {
    if (!client) return null;

    return {
      cardInfo: {
        name: client.fullName,
        id: `CL-00${client.clientId}`,
        risk: client.riskProfile,
        goal: client.investmentGoal,
        verified: client.kycStatus === 'VERIFIED'
      },
      personalInfo: {
        fullName: client.fullName,
        email: client.emailAddress,
        phone: client.phoneNumber,
        dob: client.dateOfBirth ? new Date(client.dateOfBirth) : null,
        address: client.address,
        occupation: client.occupation,
        employer: client.employer
      },
      investInfo: {
        riskProfile: client.riskProfile,
        goal: client.investmentGoal,
        horizon: client.investmentHorizon,
        liquidity: client.liquidityNeeds
      },
      summaryInfo: this.generateSmartSummary(client.riskProfile, client.investmentHorizon, client.liquidityNeeds)
    };
  }

  private generateSmartSummary(riskProfile: string, horizon: string, liquidity: string) {
    let allocation = 'Stocks 50% | Bonds 50%';
    let score = '6/10';
    let returns = '8-12%';

    if (!riskProfile) return { allocation, score, return: returns };

    if (riskProfile === 'AGGRESSIVE') {
      allocation = 'Stocks 90% | Crypto/Alt 10%'; score = '9/10'; returns = '15-20%';
    } else if (riskProfile === 'CONSERVATIVE') {
      allocation = 'Bonds 70% | Blue Chip 30%'; score = '3/10'; returns = '5-7%';
    }

    if (horizon === 'SHORT_TERM') {
      allocation = 'Bonds 80% | Cash 20%'; returns = '4-6%'; score = 'Adjusted for Short Horizon';
    }

    if (liquidity === 'HIGH') {
      allocation += ' (High Liquidity Fund)';
    }

    return { allocation, score, return: returns };
  }
}