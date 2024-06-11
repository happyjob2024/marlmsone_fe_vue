<template>
<input type="hidden" id="action" name="action" value="" /> 
		<input type="hidden" id="que_id" name="que_id" value="" />
		<input type="hidden" id="use_yn" name="use_yn" value="" />
    

		<!-- 모달 배경 -->
		<div id="mask"></div>

		<div id="wrap_area">

			<h2 class="hidden">header 영역</h2>
			<!-- <jsp:include page="/WEB-INF/view/common/header.jsp"></jsp:include> -->

			<h2 class="hidden">컨텐츠 영역</h2>
			<div id="container">
				<ul>
					<li class="contents">
						<!-- contents -->
						<h3 class="hidden">contents 영역</h3> <!-- content -->
						<div class="content">

							<p class="Location">
								<!-- <a href="../notice/notice.do" class="btn_set home">메인으로</a>  -->
								<span
									class="btn_nav bold">학습 관리</span> <span class="btn_nav bold">시험
									관리 </span> <a href="/tut/testControl.do" class="btn_set refresh">새로고침</a>
							</p>

							<p class="conTitle">
								<span>시험 문제 관리</span> <span class="fr"> 
									<label for="deactiveCk"> 
										<input type="checkbox" name="deactiveCk" id="deactiveCk" onchange="showDeactiveCk(event)"> 
										비활성화 문제&nbsp;&nbsp;
								</label> 
								<select id="lecList" style="width: 200px" v-model="lecTypeId" @change="testListRtn()">	
									<option value="">시험분류 선택</option>
									<option v-for="(list, i) in lectype" :key="i" :value="list.lec_type_id">{{ list.lec_type_name }}</option> 
								</select>						
								&nbsp; 
	<a class="btnType blue" @click="modalHandler()" name="newreg" id="newreg"><span>문제등록</span></a>
								</span>
							</p>

							<div class="divComGrpCodList">
								<table class="col">
									<caption>caption</caption>
									<colgroup>
										<col width="8%">
										<col width="8%">
										<col width="20%">
										<col width="5%">
										<col width="10%">
										<col width="10%">
										<col width="10%">
										<col width="10%">
										<col width="8%">
									</colgroup>

									<thead>
										<tr>
											<th scope="col">전체선택&nbsp;<input type="checkbox"
												name="allRowCheck" id="allRowCheck" onclick='selectAll()'></th>
											<th scope="col">시험분류</th>
											<th scope="col">문제</th>
											<th scope="col">정답</th>
											<th scope="col">보기1</th>
											<th scope="col">보기2</th>
											<th scope="col">보기3</th>
											<th scope="col">보기4</th>
											<th scope="col">
                                                <div class="btn_areaC">
												<a class="btnType3 color1"
												href="javascript:Deactivate('que_id');"><span id="activebtn" >비활성</span></a></div>
                                                </th>
										</tr>
									</thead>
									<tbody id="listTestbody">
										<template v-if="dataList.length > 0">
              							<tr v-for="(list, i) in dataList" :key="i">
                						<td><input type="checkbox" name="rowCheckbox" class="rowCheckbox" data-item-id="3"></td>
                						<td>{{ list.lec_type_name }}</td>
                						<td>{{ list.test_que }}</td>
                						<td>{{ list.que_ans }}</td>
                						<td>{{ list.que_ex1 }}</td>
                						<td>{{ list.que_ex2 }}</td>
                						<td>{{ list.que_ex3 }}</td>
                						<td>{{ list.que_ex4 }}</td>
                						<td>비활성</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="9">일치하는 검색 결과가 없습니다</td>
              </tr>
            </template>
									</tbody>
								</table>
							</div>
							<Pagination
            v-bind="{ currentPage, totalItems: total, itemsPerPage: 6 }"
            @search="testListRtn($event)"
            v-if="dataList.length > 0"
        />
		<!-- <Pagination
          :currentPage="currentPage"
          :total="total"
          @search="testListRtn($event)"
		  v-if="dataList.length > 0"
		  /> -->

						</div> <!--// content -->

						
					</li>
				</ul>
			</div>
			<TestControlModal 
			v-if="modalBoolean"
        @closeModal="modalBoolean = false"
        />
        <!-- :testListRtn="testListRtn"
        :que_id="que_id"
        :currentPage="currentPage" -->
		</div>


</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import Pagination from '@/components/common/PaginationComponent.vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';
import TestControlModal from './TestControlModal.vue';

const dataList = ref([]);
const total = ref(0);
const currentPage = ref(0);
const lectype = ref([]);
const lecTypeId = ref('');
// const paramObj = ref({});
const modalBoolean = ref(false);




const testListRtn = async (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append('cpage', cpage);
    param.append('pagesize', 6);
	param.append('lecList', lecTypeId.value);

    // axios.post('/adm/lectureRoomListjson.do', param).then((res) => {
    // dataList.value = res.data.listdata;
    // total.value = res.data.listcnt;
    // currentPage.value = cpage;
    // });
    const testList = await axiosAction(Tut.TestList, param);

    if (testList) {
        dataList.value = testList.listdata;
        total.value = testList.listcnt;
        lectype.value = testList.lectureListData;
        currentPage.value = cpage;
	console.log('asd' + total)
    }
};

const modalHandler = (param) => {
    modalBoolean.value = true;
    // equipId.value=param
// console.log(param)
};

const modalClose =(param) => {
    modalBoolean.value = param;
    getEquipmentList();
}

//   watch(lecTypeId, () => {
//     testListRtn();
//   });

onMounted(() => {
    testListRtn();
});
</script>

<style>

</style>