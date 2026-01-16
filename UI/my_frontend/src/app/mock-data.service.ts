import { Injectable } from '@angular/core';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  // This function creates specific data for whichever client you send it
  getProfileData(client: any) {
    
    // 1. Create a "Random" twist based on ID (so data looks different)
    // If ID is even (2, 4, 6), they get "Aggressive". If odd (1, 3, 5), they get "Moderate".
    const isEven = client.id % 2 === 0;
    const name = client.name;

    // 2. Build the data object using the Client's Name
    const mockResponse = {
      
      // Card Info
      cardInfo: {
        name: name,
        id: `CL-00${client.id}`,
        risk: isEven ? 'Aggressive' : 'Moderate',
        goal: isEven ? 'Wealth Creation' : 'Retirement',
        verified: true
      },

      // Personal Details (Customized with Name)
      personalInfo: {
        fullName: name,
        email: `${name.toLowerCase()}@cognizant.com`, // e.g. venu@cognizant.com
        phone: `+91 98765 0000${client.id}`,           // e.g. ...00002
        dob: new Date('1995-05-20'),
        address: `Block ${client.id}, Hitech City, Hyderabad`,
        occupation: 'Program Analyst',
        employer: 'Cognizant'
      },

      // Investment Profile (Switches based on ID)
      investInfo: isEven 
        ? { riskProfile: 'Aggressive', goal: 'Wealth', horizon: 'Long', liquidity: 'Medium' }
        : { riskProfile: 'Moderate', goal: 'Retirement', horizon: 'Medium', liquidity: 'Low' },

      // Summary
      summaryInfo: isEven
        ? { allocation: 'Stocks 80% | Crypto 20%', score: '9/10', return: '18%' }
        : { allocation: 'Bonds 60% | Stocks 40%', score: '6/10', return: '10%' }
    };

    // 3. Return as an Observable (Standard Angular way)
    return of(mockResponse);
  }
}
