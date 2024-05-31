<template>
    <div id="advice">
        <p >
           <a href="/dashboard/home" class="btn_set home"></a>
           <span class="btn_nav bold">학습 관리</span>
           <span class="btn_nav bold">수강 상담 관리</span>
        </p>
        <p class="conTitle">
           <span>수강 상담 관리 </span>
           <span class="fr">
                <select >
                    <option>
                        전체 과정 
                    </option>
                    <option v-for="(contants, i) in lecList" :key="i">
                        {{ checkDate[i] }}<span>{{" "}}</span>{{ contants.lec_name }}
                    </option>
                    
                </select>
                <a class="btn btn-primary mx-2" style="margin-left: 10px">
                    <span>상담 등록</span>
                </a>
           </span>
        </p>
    </div>
        
    <div>
        <table class="col">
            <caption></caption>
            <colgroup>
                <col width="10%" />
                <col width="30%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">상담 번호</th>
                    <th scope="col">과정 명</th>
                    <th scope="col">학생 명(ID)</th>
                    <th scope="col">상담 일자</th>
                    <th scope="col">상담자 명(ID)</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="true">
                    <tr>
                        <td>1</td>
                        <td>vue3</td>
                        <td>홍길동</td>
                        <td>2024-05-30</td>
                        <td>사장님</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
        
        
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
            lecList: [],
        };
    },
    methods: {
        getLecList() {
            let param = new URLSearchParams();
            param.append('currentPage', 1);
            param.append('pageSize', 5);
            axios.post('/adv/lecList2.do', param).then((res) => {
                this.lecList = res.data.listData;
            }
        )

        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.getLoginInfo;
        },
        currentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            return `${year}${month}${day}`
        },
        checkDate() {
            const progress = [];
                this.lecList.map((item, index) => {
                    if (item.end_date > this.currentDate) {
                        progress[index] = '(진행중)';
                    } else {
                        progress[index] = '(종료)';
                    }
                })
            return progress;
        },
    },
    mounted() {
        this.getLecList();
    },
}

</script>

<style>

</style>

