<template>
  <div class="md-layout md-alignment-center-center" style="height:100vh!">
          <md-card-header>
                  <div class="md-title">
                        Register
                  </div>
          </md-card-header>
          <form @submit.prevent="validateForm()">
                  <md-card-content>
                          <md-field md-clearable id="xxx" :class="getValidationClass('email')">
                                  <label for="email">email</label>
                                  <md-input :disabled='loading' type="email" name="email" id="email" autocomplete="email" v-model="form.email"/>
                                  <span class="md-error" v-if="$v.form.email.required">
                                          email format is wrong 
                                  </span>
                                  <span class="md-error" v-else-if="$v.form.email.email">
                                          email is required 
                                  </span>
                          </md-field>
                          <md-field :class="getValidationClass('password')">
                                  <label for="password">password</label>
                                  <md-input :disabled='loading' type="password" name="password" id="password" autocomplete="password" v-model="form.password"/>
                                  <span class="md-error" v-if="!$v.form.password.required">
                                          password is required
                                  </span>
                                  <span class="md-error" v-else-if="!$v.form.password.invalid">
                                          password should min 3 and max of 6 characters
                                  </span>
                          </md-field>
                  </md-card-content>
                  <md-card-actions>
                          <md-button to="/login">
                                Go to Login
                          </md-button>
                          <md-button class="md-primary md-raised" :disabled='loading || isValidForm' type="submit">
                                submit
                          </md-button>
                  </md-card-actions>

          </form>
          <md-snackbar :md-active.sync="isAuthenticated">
                  {{this.form.email}} was succesfully registered
          </md-snackbar>

  </div>
</template> 
<script>
import {validationMixin} from 'vuelidate';
import {required,email,minLength,maxLength} from 'vuelidate/lib/validators';

export default {
        middleware:'auth',
        mixins:[validationMixin],
        data: () => ({
                form:{
                        email:'',
                        password:''
                }
        }),
        validations:{
                form:{
                        email:{
                                required,
                                email
                        },
                        password:{
                                required,
                                minLength:minLength(6),
                                maxLength:maxLength(8 )
                        }
                }
        },
        computed:{
                loading() {
                        return this.$store.getters.loadingState
                        },
                isAuthenticated() {
                        return this.$store.getters.isAuthenticated
                        },
                isValidForm(){
                        return this.$v.$invalid
                }
        },
        watch:{
                isAuthenticated(value){
                        if(value) setTimeout(() => this.$router.push('/'),3000)
                }
        },
        methods:{
                validateForm(){
                        this.$v.$touch();
                        if(!this.$v.$invalid){
                                this.registerUser()
                        }
                },
               async registerUser(){
                       const {email,password} = {...this.form}
                       const returnSecureToken = true
                       await this.$store.dispatch('AuthenticateUser', {email,password,returnSecureToken})
               },
               getValidationClass(fieldName){
                       const field = this.$v.form[fieldName];
                       const result =  {'md-invalid':field.$invalid }
                       console.log(result)
                       if (field) {
                               return result
                               }

               }
        }
}
</script>
