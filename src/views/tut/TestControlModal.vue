<template>
  <div id="layer1" class="layerType2" style="width: 600px;">
			<dl>
				<dt>
					<strong>시험문제 등록</strong>
				</dt>
				<dd class="content">
					<!-- s : 여기에 내용입력 -->
					<table class="row">
						<caption>caption</caption>
						<colgroup>
							<col width="120px">
							<col width="*">
							<col width="120px">
							<col width="*">
						</colgroup>

						<tbody>
							<tr>
								<th scope="row">시험분류<span class="font_red">*</span></th>
								<td colspan="7"><select name="sort" id="lec_type_id"
									style="width: 100%;" v-model="question.lec_type_id">
									<option value="" id="">강의 분류 선택</option>
									<option v-for="(list, i) in lectype" :key="i" :value="list.lec_type_id">{{ list.lec_type_name }}</option>
										<!-- <c:forEach items="${lecList}" var="list"> -->
											<!-- <option value="${list.lec_type_id}">${list.lec_type_name}</option> -->
										<!-- </c:forEach>  -->
								</select></td>
							</tr>
							<tr>
								<th scope="row">문제 <span class="font_red">*</span></th>
								<td colspan="7"><textarea name="test_que" id="test_que"
										class="inputTxt p100" cols="40" rows="1" v-model="question.test_que"></textarea></td>
							</tr>
							<tr>
								<th scope="row">정답 <span class="font_red">*</span></th>
								<td colspan="3"><input type="text" class="inputTxt p50"
									name="que_ans" id="que_ans" v-model="question.que_ans"/></td>
							</tr>

							<tr>
								<th scope="row">보기1 <span class="font_red">*</span></th>
								<td colspan="7"><textarea name="que_ex1" id="que_ex1"
										class="inputTxt p100" cols="40" rows="1" v-model="question.que_ex1"></textarea></td>
							</tr>
							<tr>
								<th scope="row">보기2<span class="font_red">*</span></th>
								<td colspan="7"><textarea name="que_ex2" id="que_ex2"
										class="inputTxt p100" cols="40" rows="1" v-model="question.que_ex2"></textarea></td>
							</tr>
							<tr>
								<th scope="row">보기3 <span class="font_red">*</span></th>
								<td colspan="7"><textarea name="que_ex3" id="que_ex3"
										class="inputTxt p100" cols="40" rows="1" v-model="question.que_ex3"></textarea></td>
							</tr>
							<tr>
								<th scope="row">보기4 <span class="font_red">*</span></th>
								<td colspan="7"><textarea name="que_ex4" id="que_ex4"
										class="inputTxt p100" cols="40" rows="1" v-model="question.que_ex4"></textarea></td>
							</tr>
							<tr>
								<th scope="row">사용여부<span class="font_red">*</span></th>
								<td colspan="7"><select name="inactive" id="inactive"
									style="width: 100%;" v-model="question.use_yn">
										<option value="Y">활성화</option>
										<option value="N">비활성화</option>
								</select></td>
							</tr>
						</tbody>


					</table>

					<!-- e : 여기에 내용입력 -->

					<div class="btn_areaC mt30">
						<a @click="insertQue('I')" class="btnType blue" id="btnSave" name="btn"><span>저장</span></a>
						<a @click="$emit('closeModal', false)" class="btnType gray" id="btnClose" name="btn"><span>취소</span></a>
					</div>
				</dd>
			</dl>
			<a @click="$emit('closeModal', false)" class="closePop"><span class="hidden">닫기</span></a>
		</div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

    const props = defineProps({
        que_id: Number,
		lectype: [],
    });
	const question = ref(new Object());
	const updateHandler = ref(props.equipId ? 'U' :'I');
	const emit = defineEmits(['closeModal']);

	const insertQue = () => {
    let param = new URLSearchParams(question.value);
	console.log('액션은?? ', updateHandler, '리절트코드는? ', )
    param.append('action', updateHandler.value);
    param.append('lecrm_id', props.que_id);

    axios.post('/tut/testSave.do', param).then((res) => {
        if (res.data.result) {
			console.log('리절트코드 = ', res.data.result )
            alert(res.data.resultMsg);
            emit('closeModal');
        }
    });
};

const getQueDetail = () => {
    let param = new URLSearchParams();
    param.append('que_id', props.que_id);

    axios.post('/tut/testModifyList.do', param).then((res) => {
        question.value = res.data.selinfo;
		console.log('되니되니' + res.data.selinfo)
    });
};
onMounted(() =>{
        props.que_id ? getQueDetail() : null;
		// getQueDetail()
    });

</script>

<style>

</style>