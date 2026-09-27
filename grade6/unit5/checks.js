/* Decimal Diner: limits for tools/fuzz.mjs. Per station: dp = most decimal places, nz = most nonzero digits,
   max = largest value, for the answer and every number in the prompt. Keep numbers friendly for mental math. */
module.exports = {
  limits: {
    reg:   {dp: 2, nz: 3, max: 10},
    point: {dp: 3, nz: 2, max: 100},
    weigh: {dp: 2, nz: 3, max: 30},
    share: {dp: 2, nz: 3, max: 750},
    pour:  {dp: 2, nz: 2, max: 20},
    rush:  {dp: 2, nz: 4, max: 20},
  },
};
