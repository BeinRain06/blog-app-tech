<template>
  <div class="register w-full">
    <div class="upper_wrapper w-full"></div>
    <div class="lower_wrapper w-full h-full bg-gray-300"></div>
    <div class="register_wrapper">
      <form class="register_form h-full">
        <fieldset class="fieldset_area h-full">
          <legend class="register_title">Register</legend>
          <div class="form_content">
            <div class="field_msg w-full flex flex-col justify-start pl-2">
              <p class="text-blue-800">Board Featurings Tech Articles, Culture and New Discovery</p>
              <p class="text-green-500">Meets New Expectations on Daily Basis ¬!</p>
            </div>
            <div class="form_control">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_content"
                name="email"
                placeholder="address_Email"
                focus
              />
            </div>
            <div class="form_control">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_content"
                name="password"
                min-length="8"
                placeholder="Password"
              />
            </div>
            <div class="form_control">
              <label for="password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                class="input_content"
                name="confirm_password"
                min-length="8"
                placeholder="Confirm Password"
              />
            </div>
            <div class="form_custom">
              <ul class="label_custom w-full flex justify-center items-center py-2 gap-2">
                <label for="password" class="pr-2"> Custom (Optional)</label>
                <input type="radio" id="custom" class="input_radio" name="custom" />
              </ul>
              <input
                type="text"
                id="custom"
                class="input_content"
                name="custom"
                min-length="8"
                placeholder="Custom"
                disabled
              />
            </div>
            <div class="form_submit">
              <input type="submit" id="btn_identity" class="btn_identity" value="register" />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 180px) {
  p {
    padding: 0.25rem 0;
    tex-align: center;
    line-height: 1.3;
    font-size: calc(12px + 0.5vw);
  }

  .register {
    position: relative;
    height: calc(80vh);
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 56% 1fr;
  }

  .register_wrapper {
    @apply w-11/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 30rem;
    padding: 0 1rem;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 4px hsl(240, 2%, 62%);
  }

  .register_title {
    position: relative;
    top: -2rem;
    left: -0.25rem;
    width: 8rem;
    padding: 0.5rem;
    background-color: #fff;
    font-size: calc(27px + 0.3vw);

    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 440;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .field_msg {
    display: none;
  }

  .form_content {
    position: relative;
    top: -1.4rem;
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: 16% 22% 22% 22% auto;
  }

  .form_control,
  .form_custom {
    @apply w-full h-auto flex flex-col justify-center text-gray-600 gap-2;
  }

  .input_content {
    @apply border border-solid border-gray-300;
    width: 100%;
    height: 2.1rem;
    text-indent: 10px;
    transform: skewX(-2deg);
    transition: all 600ms ease-in-out;
  }

  .input_content:focus {
    transform: skewX(0deg);
  }

  input[type='radio'] {
    appearance: none;
    -moz-appearance: none;
    --webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    @apply bg-white border-2 border-white ring-1 ring-gray-600;
  }

  input[type='radio']:checked {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    @apply bg-green-500 border-2 border-white ring-1 ring-green-500;
  }

  input[type='submit'] {
    @apply w-full h-auto text-white bg-gray-800 p-2 rounded-lg text-center;
    position: relative;
    top: 2.25rem;
  }
}

@media (min-width: 240px) {
  .register {
    height: calc(102vh);
  }

  .register_wrapper {
    height: 40rem;
  }

  .field_msg {
    display: block;
  }

  .form_content {
    grid-auto-rows: 16% 16% 16% 22% auto;
  }

  .input_content {
    height: 2.8rem;
  }
}

@media (min-width: 540px) {
  p {
    width: calc(100% - 5px);
    font-size: calc(15px + 0.3vw);
  }

  .register {
    height: calc(108vh);
  }

  .register_wrapper {
    @apply w-8/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    height: 44rem;
    padding: 0 1rem;
  }

  .register_title {
    font-size: calc(30px + 0.3vw);
  }
}
</style>