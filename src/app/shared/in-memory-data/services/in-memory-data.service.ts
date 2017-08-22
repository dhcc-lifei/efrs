/**
 * Created by lifei on 2017/3/16.
 */
import {InMemoryDbService} from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let pagerModel = {
            total: 2,
            pageData: [
			    {userId: '11', userName: '张三', gender: '男', age: 24},
                {userId: '20', userName: '李四', gender: '男', age: 21}
		    ]
        };
        
		return {pagerModel};
    }
}