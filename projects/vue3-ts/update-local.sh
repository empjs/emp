
cd /www/efox-local-lab/empvue3/emp-workspace && git pull
cd /www/efox-local-lab/empvue3/emp-workspace/projects && yarn build:vue
rm -rf /www/efox-local-lab/empvue3/base && rm -rf /www/efox-local-lab/empvue3/components
cp -rf /www/efox-local-lab/empvue3/emp-workspace/projects/vue3-base/dist/ /www/efox-local-lab/empvue3/base
cp -rf /www/efox-local-lab/empvue3/emp-workspace/projects/vue3-project/dist/ /www/efox-local-lab/empvue3/components