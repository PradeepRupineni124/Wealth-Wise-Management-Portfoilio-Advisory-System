import { Injectable } from '@angular/core';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  
  getProfileData(client: any) {
    
    
    const isEven = client.id % 2 === 0;
    const name = client.name;

    
    const mockResponse = {
      
     
      cardInfo: {
        name: name,
        id: `CL-00${client.id}`,
        risk: isEven ? 'Aggressive' : 'Moderate',
        goal: isEven ? 'Wealth Creation' : 'Retirement',
        verified: true
      },

      
      personalInfo: {
        fullName: name,
        email: `${name.toLowerCase()}@cognizant.com`, 
        phone: `+91 98765 0000${client.id}`,           
        dob: new Date('1995-05-20'),
        address: `Block ${client.id}, Hitech City, Hyderabad`,
        occupation: 'Program Analyst',
        employer: 'Cognizant'
      },

     
      investInfo: isEven 
        ? { riskProfile: 'Aggressive', goal: 'Wealth', horizon: 'Long', liquidity: 'Medium' }
        : { riskProfile: 'Moderate', goal: 'Retirement', horizon: 'Medium', liquidity: 'Low' },

     
      summaryInfo: isEven
        ? { allocation: 'Stocks 80% | Crypto 20%', score: '9/10', return: '18%' }
        : { allocation: 'Bonds 60% | Stocks 40%', score: '6/10', return: '10%' }
    };

    
    return of(mockResponse);
  }
}
