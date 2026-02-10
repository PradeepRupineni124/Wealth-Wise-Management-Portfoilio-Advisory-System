import { Injectable } from '@angular/core';
import { of, delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  
  // --- EXISTING: Profile Logic ---
  getProfileData(client: any) {
    // 1. CHECK: Does this client already have data from the Registration Form?
    if (client.investInfo && client.personalInfo) {
      return this.getRealClientData(client);
    }
    // 2. FALLBACK: Generate Mock Data
    return this.getMockClientData(client);
  }

  getKycData(client: any): Observable<any> {
    if (client && client.kycDocument) {
      return of({
        fileName: client.kycDocument.name || 'uploaded_document.pdf',
        fileType: client.kycDocument.type || 'application/pdf',
        uploadDate: new Date().toISOString().split('T')[0], 
        status: 'PENDING',
        url: '' 
      }).pipe(delay(600));
    }

    if (client && client.id && !client.investInfo) {
      const isEven = client.id % 2 === 0;
      return of({
        fileName: isEven ? 'pan_card_final.jpg' : 'aadhaar_scan_front.pdf',
        fileType: isEven ? 'image/jpeg' : 'application/pdf',
        uploadDate: '2025-11-15',
        status: isEven ? 'VERIFIED' : 'PENDING',
        url: 'assets/mock-kyc.jpg' 
      }).pipe(delay(800));
    }

    return of(null).pipe(delay(500));
  }

  // Fixed: Added ': Observable<any>' return type
  uploadKycDoc(file: File): Observable<any> {
    return of({ success: true, fileName: file.name }).pipe(delay(1500));
  }


  // --- EXISTING: Helper Logic (Unchanged) ---
  
  private getRealClientData(client: any) {
    const risk = client.investInfo.riskProfile || 'Moderate - Balanced Growth';
    const horizon = client.investInfo.horizon || 'Medium-term (3-7 years)';
    const liquidity = client.investInfo.liquidity || 'Medium - Occasional access';
    
    return of({
      cardInfo: {
        name: client.name,
        id: `CL-00${client.id}`,
        risk: risk,
        goal: client.investInfo.goal,
        verified: false 
      },
      personalInfo: {
        fullName: client.name,
        email: client.email || 'pending@email.com',
        phone: client.personalInfo.phone || '+91 00000 00000',
        dob: new Date(),
        address: client.personalInfo.address || 'Address Pending',
        occupation: client.personalInfo.occupation,
        employer: client.personalInfo.employer
      },
      investInfo: client.investInfo,
      summaryInfo: this.generateSmartSummary(risk, horizon, liquidity)
    });
  }

  private getMockClientData(client: any) {
    const isEven = client.id % 2 === 0;
    const name = client.name;
    
    const risk = isEven ? 'Aggressive - Maximum Growth' : 'Moderate - Balanced Growth';
    const horizon = isEven ? 'Very Long-term (10-15 years)' : 'Medium-term (3-7 years)';
    const liquidity = isEven ? 'Medium - Occasional access' : 'Low - Rarely need access';

    return of({
      cardInfo: {
        name: name,
        id: `CL-00${client.id}`,
        risk: risk,
        goal: isEven ? 'Wealth Accumulation' : 'Retirement Planning',
        verified: true
      },
      personalInfo: {
        fullName: name,
        email: `${name.toLowerCase().replace(' ', '.')}@cognizant.com`,
        phone: `+91 98765 0000${client.id}`,
        dob: new Date('1995-05-20'),
        address: `Block ${client.id}, Hitech City, Hyderabad`,
        occupation: 'Program Analyst',
        employer: 'Cognizant'
      },
      investInfo: isEven 
        ? { riskProfile: 'Aggressive - Maximum Growth', goal: 'Wealth Accumulation', horizon: 'Very Long-term (10-15 years)', liquidity: 'Medium - Occasional access' }
        : { riskProfile: 'Moderate - Balanced Growth', goal: 'Retirement Planning', horizon: 'Medium-term (3-7 years)', liquidity: 'Low - Rarely need access' },
      summaryInfo: this.generateSmartSummary(risk, horizon, liquidity)
    });
  }

  private generateSmartSummary(riskProfile: string, horizon: string, liquidity: string) {
    let allocation = 'Stocks 50% | Bonds 50%';
    let score = '6/10';
    let returns = '8-12%';

    if (riskProfile.includes('Aggressive')) {
      allocation = 'Stocks 90% | Crypto/Alt 10%';
      score = '9/10';
      returns = '15-20%';
    } else if (riskProfile.includes('Conservative')) {
      allocation = 'Bonds 70% | Blue Chip 30%';
      score = '3/10';
      returns = '5-7%';
    }

    if (horizon.includes('Short')) {
      allocation = 'Bonds 80% | Cash 20%';
      returns = '4-6%'; 
      score = 'Adjusted for Short Horizon';
    }

    if (liquidity.includes('High') || liquidity.includes('Frequent')) {
      allocation += ' (High Liquidity Fund)';
    }

    return { allocation, score, return: returns };
  }
}