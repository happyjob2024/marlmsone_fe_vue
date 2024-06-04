<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import StudentList from '@/components/employ/StudentList.vue';
import SaveEmployModal from '@/components/modals/employ/SaveEmployModal.vue';
import { Employ } from '@/api/api';
import { EmptyEmploy } from '@/common/models/Employ';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const emptyEmploy = {
    action: 'U',
    ...EmptyEmploy,
};

const pageSize = 5;
const currentPage = ref(1);
const totalCount = ref(0);

const searchValue = ref('');
const searchKey = ref('all');
const list = ref([]);

const studentListRef = ref();
const updateEmploy = ref(emptyEmploy);
const updateModalFlag = ref(false);

const searchList = (page) => {
    page = page || 1;

    const params = new URLSearchParams();
    params.append('currentPage', page);
    params.append('pageSize', pageSize);
    params.append('searchInfo', searchValue.value);
    params.append('searchKey', searchKey.value);

    axios
        .post(Employ.GetList, params)
        .then((res) => {
            list.value = res.data.empInfo;
            totalCount.value = res.data.emp_Total;
            currentPage.value = page;
        })
        .catch((_) => {
            alert('목록을 불러오는데 실패했습니다.');
        });
};

const openUpdateModal = (employ) => {
    updateEmploy.value = {
        action: 'U',
        id: employ.std_id,
        name: employ.name,
        company: employ.comp_name,
        tel: employ.tel,
        startDate: employ.employ_day,
        endDate: employ.resign_day,
    };
    updateModalFlag.value = true;
};

const closeUpdateModal = (data) => {
    updateEmploy.value = emptyEmploy;
    updateModalFlag.value = false;

    if (data) {
        list.value = list.value.map((i) => {
            if (i.std_id === data.id) {
                return {
                    ...i,
                    comp_name: data.company,
                    employ_day: data.startDate,
                    resign_day: data.endDate,
                    wp_state: data.endDate ? '퇴사' : '재직중',
                };
            } else {
                return i;
            }
        });
    }
};

const deleteInfo = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
        axios
            .post(Employ.Delete, null, { params: { std_id: id } })
            .then((res) => {
                alert(res.data.resultMsg);
                searchList(list.value.length === 1 ? 1 : currentPage.value);
                studentListRef.value.searchList();
            })
            .catch((_) => {
                alert('삭제에 실패했습니다.');
            });
    }
};

onMounted(() => {
    searchList();
});
</script>

<template>
    <div class="content">
        <p class="Location">
            <a href="#" class="btn_set home">메인으로</a>
            <span class="btn_nav bold">취업 관리 / 취업 정보</span>
            <a href="#" class="btn_set refresh">새로고침</a>
        </p>
        <p class="conTitle">
            <span>취업목록</span>
            <span class="search">
                <select class="form-select" v-model="searchKey">
                    <option value="all">전체</option>
                    <option value="name">학생명</option>
                    <option value="comp_name">회사명</option>
                </select>
                <input type="text" class="form-control" v-model="searchValue" />
                <button class="btn btn-primary" @click="searchList()">
                    검색
                </button>
            </span>
        </p>
        <div>
            <table class="col">
                <colgroup>
                    <col width="7%" />
                    <col width="10%" />
                    <col width="12%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="28%" />
                    <col width="10%" />
                    <col width="13%" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">학번</th>
                        <th scope="col">학생명</th>
                        <th scope="col">연락처</th>
                        <th scope="col">입사일</th>
                        <th scope="col">퇴사일</th>
                        <th scope="col">회사명</th>
                        <th scope="col">재직여부</th>
                        <th scope="col">수정/삭제</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!list.length">
                        <td colSpan="8">해당되는 데이터가 없습니다.</td>
                    </tr>
                    <tr v-for="item in list" :key="item.std_id">
                        <td>{{ item.std_num }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.tel }}</td>
                        <td>{{ item.employ_day }}</td>
                        <td>{{ item.resign_day }}</td>
                        <td>{{ item.comp_name }}</td>
                        <td>{{ item.wp_state }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                @click="openUpdateModal(item)"
                            >
                                수정
                            </button>
                            /
                            <button
                                class="btn btn-primary"
                                @click="deleteInfo(item.std_id)"
                            >
                                삭제
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination
                v-bind="{
                    currentPage,
                    totalItems: totalCount,
                    itemsPerPage: pageSize,
                }"
                @search="search($event)"
                v-if="list.length > 0"
                style="margin: 15px 0 30px 0"
            />
        </div>
        <StudentList ref="studentListRef" @doAction="searchList()" />
        <SaveEmployModal
            v-if="updateModalFlag"
            :info="updateEmploy"
            @closeModal="closeUpdateModal"
        />
    </div>
</template>

<style scoped>
.btn {
    padding: 6px;
    font-size: 15px;
}
</style>
